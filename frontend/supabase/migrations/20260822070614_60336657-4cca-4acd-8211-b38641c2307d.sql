REVOKE EXECUTE ON FUNCTION public.current_role_name() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_hr_admin() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.current_employee_id() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.current_role_name() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_hr_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_employee_id() TO authenticated;