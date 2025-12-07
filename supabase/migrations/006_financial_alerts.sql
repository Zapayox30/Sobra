-- Financial Alerts System
-- Detects spending anomalies and generates intelligent alerts

-- Create enum types for alerts
CREATE TYPE alert_type AS ENUM (
  'overspending',
  'under_budget',
  'no_activity',
  'achievement',
  'budget_warning',
  'goal_progress'
);

CREATE TYPE alert_severity AS ENUM (
  'info',
  'warning',
  'critical',
  'success'
);

-- Create financial_alerts table
CREATE TABLE financial_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_type alert_type NOT NULL,
  severity alert_severity NOT NULL DEFAULT 'info',

  -- Alert content
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT, -- expense category if relevant

  -- Metrics for context
  amount_spent DECIMAL(10, 2),
  amount_average DECIMAL(10, 2),
  amount_budget DECIMAL(10, 2),
  percentage_diff DECIMAL(5, 2), -- percentage difference from average/budget

  -- Alert metadata
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  is_dismissed BOOLEAN NOT NULL DEFAULT FALSE,
  action_url TEXT, -- optional link to take action

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  dismissed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX idx_financial_alerts_user_id ON financial_alerts(user_id);
CREATE INDEX idx_financial_alerts_created_at ON financial_alerts(created_at DESC);
CREATE INDEX idx_financial_alerts_is_read ON financial_alerts(is_read) WHERE is_read = FALSE;
CREATE INDEX idx_financial_alerts_user_unread ON financial_alerts(user_id, created_at DESC) WHERE is_read = FALSE;

-- Enable Row Level Security
ALTER TABLE financial_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own alerts"
  ON financial_alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own alerts"
  ON financial_alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts"
  ON financial_alerts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own alerts"
  ON financial_alerts FOR DELETE
  USING (auth.uid() = user_id);

-- Function to mark alert as read
CREATE OR REPLACE FUNCTION mark_alert_as_read(alert_id UUID)
RETURNS financial_alerts
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result financial_alerts;
BEGIN
  UPDATE financial_alerts
  SET
    is_read = TRUE,
    read_at = NOW()
  WHERE
    id = alert_id
    AND user_id = auth.uid()
  RETURNING * INTO result;

  RETURN result;
END;
$$;

-- Function to mark all alerts as read
CREATE OR REPLACE FUNCTION mark_all_alerts_as_read()
RETURNS SETOF financial_alerts
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  UPDATE financial_alerts
  SET
    is_read = TRUE,
    read_at = NOW()
  WHERE
    user_id = auth.uid()
    AND is_read = FALSE
  RETURNING *;
END;
$$;

-- Function to get unread alert count
CREATE OR REPLACE FUNCTION get_unread_alert_count()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  count INTEGER;
BEGIN
  SELECT COUNT(*)::INTEGER INTO count
  FROM financial_alerts
  WHERE
    user_id = auth.uid()
    AND is_read = FALSE;

  RETURN count;
END;
$$;

-- Function to clean old alerts (optional - can be run via cron)
CREATE OR REPLACE FUNCTION cleanup_old_alerts()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete read alerts older than 90 days
  WITH deleted AS (
    DELETE FROM financial_alerts
    WHERE
      is_read = TRUE
      AND created_at < NOW() - INTERVAL '90 days'
    RETURNING *
  )
  SELECT COUNT(*)::INTEGER INTO deleted_count FROM deleted;

  RETURN deleted_count;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION mark_alert_as_read(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION mark_all_alerts_as_read() TO authenticated;
GRANT EXECUTE ON FUNCTION get_unread_alert_count() TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_alerts() TO authenticated;
