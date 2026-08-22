INSERT INTO public.users (id, employee_id, email, password_hash, role, is_verified) VALUES
 ('00000000-0000-4000-8000-000000000001','DF-1001','hr@dayflow.io','managed_by_cloud_auth','HR_ADMIN',true),
 ('00000000-0000-4000-8000-000000000002','DF-2041','nirjala.chauhan@dayflow.io','managed_by_cloud_auth','EMPLOYEE',true),
 ('00000000-0000-4000-8000-000000000003','DF-2042','rohan.verma@dayflow.io','managed_by_cloud_auth','EMPLOYEE',true),
 ('00000000-0000-4000-8000-000000000004','DF-2043','priya.nair@dayflow.io','managed_by_cloud_auth','EMPLOYEE',true),
 ('00000000-0000-4000-8000-000000000005','DF-2044','sameer.khan@dayflow.io','managed_by_cloud_auth','EMPLOYEE',true),
 ('00000000-0000-4000-8000-000000000006','DF-2045','ananya.rao@dayflow.io','managed_by_cloud_auth','EMPLOYEE',true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.employees (id, user_id, first_name, last_name, phone, address, department, designation, joining_date, is_active) VALUES
 ('11111111-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000001','Aarav','Mehta','+91 98200 10011','14 MG Road, Bengaluru, KA 560001','People Operations','HR Manager','2021-06-14',true),
 ('11111111-0000-4000-8000-000000000002','00000000-0000-4000-8000-000000000002','Nirjala','Chauhan','+91 98204 41123','221 Indiranagar, Bengaluru, KA 560038','Design','Product Designer','2023-03-12',true),
 ('11111111-0000-4000-8000-000000000003','00000000-0000-4000-8000-000000000003','Rohan','Verma','+91 98111 22334','8 Koramangala, Bengaluru, KA 560034','Engineering','Backend Engineer','2022-09-05',true),
 ('11111111-0000-4000-8000-000000000004','00000000-0000-4000-8000-000000000004','Priya','Nair','+91 99005 78120','56 Whitefield, Bengaluru, KA 560066','Engineering','Frontend Engineer','2024-01-22',true),
 ('11111111-0000-4000-8000-000000000005','00000000-0000-4000-8000-000000000005','Sameer','Khan','+91 98866 45019','3 HSR Layout, Bengaluru, KA 560102','Sales','Account Executive','2023-11-02',true),
 ('11111111-0000-4000-8000-000000000006','00000000-0000-4000-8000-000000000006','Ananya','Rao','+91 90080 33127','77 Jayanagar, Bengaluru, KA 560041','Finance','Financial Analyst','2022-02-17',false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.payrolls (id, employee_id, base_salary, allowances, deductions, net_salary, bank_account_details, payment_frequency) VALUES
 ('22222222-0000-4000-8000-000000000001','11111111-0000-4000-8000-000000000001',95000,38000,21500,111500,'{"bank":"HDFC Bank","account_number":"XXXX4412","ifsc":"HDFC0001234"}','MONTHLY'),
 ('22222222-0000-4000-8000-000000000002','11111111-0000-4000-8000-000000000002',77500,65000,27550,114950,'{"bank":"HDFC Bank","account_number":"XXXX9921","ifsc":"HDFC0000456"}','MONTHLY'),
 ('22222222-0000-4000-8000-000000000003','11111111-0000-4000-8000-000000000003',88000,52000,26400,113600,'{"bank":"ICICI Bank","account_number":"XXXX3310","ifsc":"ICIC0004521"}','MONTHLY'),
 ('22222222-0000-4000-8000-000000000004','11111111-0000-4000-8000-000000000004',69000,41000,19800,90200,'{"bank":"Axis Bank","account_number":"XXXX7745","ifsc":"UTIB0002210"}','MONTHLY'),
 ('22222222-0000-4000-8000-000000000005','11111111-0000-4000-8000-000000000005',61000,47000,18100,89900,'{"bank":"SBI","account_number":"XXXX1188","ifsc":"SBIN0011223"}','MONTHLY'),
 ('22222222-0000-4000-8000-000000000006','11111111-0000-4000-8000-000000000006',72000,36000,20400,87600,'{"bank":"Kotak Bank","account_number":"XXXX5502","ifsc":"KKBK0000789"}','MONTHLY')
ON CONFLICT (id) DO NOTHING;

UPDATE public.employees e SET payroll_id = p.id FROM public.payrolls p WHERE p.employee_id = e.id AND e.payroll_id IS NULL;

INSERT INTO public.attendances (employee_id, date, check_in_time, check_out_time, status)
SELECT e.id,
       d::date,
       CASE WHEN s.status IN ('PRESENT','HALF_DAY') THEN (d::date + TIME '09:00') AT TIME ZONE 'Asia/Kolkata' + (s.jitter || ' minutes')::interval ELSE NULL END,
       CASE WHEN s.status = 'PRESENT' THEN (d::date + TIME '18:00') AT TIME ZONE 'Asia/Kolkata' + (s.jitter || ' minutes')::interval
            WHEN s.status = 'HALF_DAY' THEN (d::date + TIME '13:30') AT TIME ZONE 'Asia/Kolkata'
            ELSE NULL END,
       s.status
FROM public.employees e
CROSS JOIN LATERAL generate_series(CURRENT_DATE - 44, CURRENT_DATE, INTERVAL '1 day') d
CROSS JOIN LATERAL (
  SELECT CASE
           WHEN (('x' || substr(md5(e.id::text || d::text), 1, 6))::bit(24)::int % 23) = 0 THEN 'ABSENT'
           WHEN (('x' || substr(md5(e.id::text || d::text), 1, 6))::bit(24)::int % 17) = 0 THEN 'LEAVE'
           WHEN (('x' || substr(md5(e.id::text || d::text), 1, 6))::bit(24)::int % 19) = 0 THEN 'HALF_DAY'
           ELSE 'PRESENT'
         END AS status,
         (('x' || substr(md5(e.id::text || d::text), 7, 4))::bit(16)::int % 35) AS jitter
) s
WHERE EXTRACT(ISODOW FROM d) < 6
  AND NOT (d::date = CURRENT_DATE)
ON CONFLICT (employee_id, date) DO NOTHING;

INSERT INTO public.leaves (employee_id, start_date, end_date, type, status, reason, reviewer_comments, reviewed_by, applied_at) VALUES
 ('11111111-0000-4000-8000-000000000002', CURRENT_DATE + 6, CURRENT_DATE + 7, 'PAID', 'PENDING', 'Family function out of town.', NULL, NULL, now() - interval '2 days'),
 ('11111111-0000-4000-8000-000000000002', CURRENT_DATE - 12, CURRENT_DATE - 12, 'SICK', 'APPROVED', 'Viral fever, advised rest by doctor.', 'Get well soon.', '00000000-0000-4000-8000-000000000001', now() - interval '13 days'),
 ('11111111-0000-4000-8000-000000000002', CURRENT_DATE - 40, CURRENT_DATE - 36, 'PAID', 'APPROVED', 'Annual vacation with family.', 'Approved, handover completed.', '00000000-0000-4000-8000-000000000001', now() - interval '45 days'),
 ('11111111-0000-4000-8000-000000000002', CURRENT_DATE - 60, CURRENT_DATE - 59, 'UNPAID', 'REJECTED', 'Personal errands.', 'Sprint release week — please re-plan.', '00000000-0000-4000-8000-000000000001', now() - interval '62 days'),
 ('11111111-0000-4000-8000-000000000003', CURRENT_DATE + 3, CURRENT_DATE + 4, 'SICK', 'PENDING', 'Minor surgery follow-up.', NULL, NULL, now() - interval '1 day'),
 ('11111111-0000-4000-8000-000000000004', CURRENT_DATE + 10, CURRENT_DATE + 14, 'PAID', 'PENDING', 'Wedding in the family.', NULL, NULL, now() - interval '4 hours'),
 ('11111111-0000-4000-8000-000000000005', CURRENT_DATE - 5, CURRENT_DATE - 5, 'UNPAID', 'APPROVED', 'House shifting.', 'Approved.', '00000000-0000-4000-8000-000000000001', now() - interval '8 days'),
 ('11111111-0000-4000-8000-000000000006', CURRENT_DATE - 20, CURRENT_DATE - 18, 'SICK', 'APPROVED', 'Recovering from dengue.', 'Take care.', '00000000-0000-4000-8000-000000000001', now() - interval '22 days');