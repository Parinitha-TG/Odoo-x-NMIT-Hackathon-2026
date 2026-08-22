-- USERS
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('EMPLOYEE', 'HR_ADMIN')),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PAYROLLS
CREATE TABLE IF NOT EXISTS public.payrolls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    base_salary NUMERIC(12, 2) DEFAULT 0.00,
    allowances NUMERIC(12, 2) DEFAULT 0.00,
    deductions NUMERIC(12, 2) DEFAULT 0.00,
    net_salary NUMERIC(12, 2) DEFAULT 0.00,
    bank_account_details JSONB DEFAULT '{}'::jsonb,
    payment_frequency VARCHAR(20) DEFAULT 'MONTHLY',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- EMPLOYEES
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    payroll_id UUID UNIQUE REFERENCES public.payrolls(id) ON DELETE SET NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    profile_picture_url TEXT,
    department VARCHAR(100),
    designation VARCHAR(100),
    joining_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.payrolls
ADD COLUMN IF NOT EXISTS employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE;

-- ATTENDANCES
CREATE TABLE IF NOT EXISTS public.attendances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_out_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PRESENT', 'ABSENT', 'HALF_DAY', 'LEAVE')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_employee_date UNIQUE (employee_id, date)
);

-- LEAVES
CREATE TABLE IF NOT EXISTS public.leaves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('PAID', 'SICK', 'UNPAID')),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    reason TEXT,
    reviewer_comments TEXT,
    reviewed_by UUID REFERENCES public.users(id),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Helper functions (SECURITY DEFINER to avoid recursive RLS)
CREATE OR REPLACE FUNCTION public.current_role_name()
RETURNS TEXT LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT role FROM public.users WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.is_hr_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'HR_ADMIN')
$$;

CREATE OR REPLACE FUNCTION public.current_employee_id()
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id FROM public.employees WHERE user_id = auth.uid()
$$;

-- GRANTS
GRANT SELECT ON public.users TO authenticated;
GRANT ALL ON public.users TO service_role;
GRANT SELECT ON public.employees TO authenticated;
GRANT ALL ON public.employees TO service_role;
GRANT SELECT ON public.payrolls TO authenticated;
GRANT ALL ON public.payrolls TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.attendances TO authenticated;
GRANT ALL ON public.attendances TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.leaves TO authenticated;
GRANT ALL ON public.leaves TO service_role;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payrolls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_self_or_hr" ON public.users FOR SELECT TO authenticated
USING (id = auth.uid() OR public.is_hr_admin());

CREATE POLICY "employees_select_self_or_hr" ON public.employees FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.is_hr_admin());

CREATE POLICY "payrolls_select_own_or_hr" ON public.payrolls FOR SELECT TO authenticated
USING (employee_id = public.current_employee_id() OR public.is_hr_admin());

CREATE POLICY "attendances_select_own_or_hr" ON public.attendances FOR SELECT TO authenticated
USING (employee_id = public.current_employee_id() OR public.is_hr_admin());
CREATE POLICY "attendances_insert_own" ON public.attendances FOR INSERT TO authenticated
WITH CHECK (employee_id = public.current_employee_id());
CREATE POLICY "attendances_update_own" ON public.attendances FOR UPDATE TO authenticated
USING (employee_id = public.current_employee_id())
WITH CHECK (employee_id = public.current_employee_id());

CREATE POLICY "leaves_select_own_or_hr" ON public.leaves FOR SELECT TO authenticated
USING (employee_id = public.current_employee_id() OR public.is_hr_admin());
CREATE POLICY "leaves_insert_own" ON public.leaves FOR INSERT TO authenticated
WITH CHECK (employee_id = public.current_employee_id() AND status = 'PENDING');
CREATE POLICY "leaves_update_hr" ON public.leaves FOR UPDATE TO authenticated
USING (public.is_hr_admin()) WITH CHECK (public.is_hr_admin());