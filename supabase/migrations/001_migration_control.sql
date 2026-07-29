-- Module migration status (shared between teammates)
CREATE TABLE IF NOT EXISTS public.module_status (
  module_id text PRIMARY KEY,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','in_progress','blocked','passed','failed')),
  assignee text,
  notes text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by text
);

-- Per-step test checklist progress
CREATE TABLE IF NOT EXISTS public.test_progress (
  module_id text NOT NULL REFERENCES public.module_status(module_id) ON DELETE CASCADE,
  step_id text NOT NULL,
  done boolean NOT NULL DEFAULT false,
  result text NOT NULL DEFAULT 'pending'
    CHECK (result IN ('pending','pass','fail','skip')),
  note text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (module_id, step_id)
);

CREATE INDEX IF NOT EXISTS test_progress_module_id_idx ON public.test_progress(module_id);

ALTER TABLE public.module_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_all_module_status" ON public.module_status;
CREATE POLICY "anon_all_module_status" ON public.module_status
  FOR ALL TO anon, authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_all_test_progress" ON public.test_progress;
CREATE POLICY "anon_all_test_progress" ON public.test_progress
  FOR ALL TO anon, authenticated
  USING (true) WITH CHECK (true);

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.module_status;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.test_progress;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
