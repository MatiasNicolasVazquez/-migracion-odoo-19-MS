-- Remove unused task_list module from shared migration control
DELETE FROM public.test_progress WHERE module_id = 'task_list';
DELETE FROM public.module_status WHERE module_id = 'task_list';
