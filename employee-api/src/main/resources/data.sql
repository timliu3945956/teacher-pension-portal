INSERT INTO employees (first_name, last_name, email, department, salary) VALUES
  -- Engineering
  ('Alice',     'Johnson',   'alice.johnson@company.com',   'Engineering', 85000.00),
  ('Bob',       'Smith',     'bob.smith@company.com',       'Engineering', 90000.00),
  ('Eva',       'Martinez',  'eva.martinez@company.com',    'Engineering', 95000.00),
  ('James',     'Carter',    'james.carter@company.com',    'Engineering', 102000.00),
  ('Priya',     'Patel',     'priya.patel@company.com',     'Engineering', 98000.00),
  ('Marcus',    'Chen',      'marcus.chen@company.com',     'Engineering', 88000.00),
  ('Sofia',     'Nguyen',    'sofia.nguyen@company.com',    'Engineering', 91000.00),

  -- HR
  ('Carol',     'White',     'carol.white@company.com',     'HR', 72000.00),
  ('Linda',     'Brooks',    'linda.brooks@company.com',    'HR', 68000.00),
  ('Omar',      'Hassan',    'omar.hassan@company.com',     'HR', 74000.00),

  -- Finance
  ('David',     'Lee',       'david.lee@company.com',       'Finance', 78000.00),
  ('Rachel',    'Kim',       'rachel.kim@company.com',      'Finance', 83000.00),
  ('Thomas',    'Grant',     'thomas.grant@company.com',    'Finance', 92000.00),
  ('Aisha',     'Williams',  'aisha.williams@company.com',  'Finance', 76000.00),

  -- Marketing
  ('Natalie',   'Ford',      'natalie.ford@company.com',    'Marketing', 70000.00),
  ('Derek',     'Owens',     'derek.owens@company.com',     'Marketing', 74000.00),
  ('Yuna',      'Park',      'yuna.park@company.com',       'Marketing', 71000.00),
  ('Chris',     'Morgan',    'chris.morgan@company.com',    'Marketing', 67000.00),

  -- Sales
  ('Jessica',   'Turner',    'jessica.turner@company.com',  'Sales', 65000.00),
  ('Kevin',     'Adams',     'kevin.adams@company.com',     'Sales', 80000.00),
  ('Fatima',    'Malik',     'fatima.malik@company.com',    'Sales', 73000.00),
  ('Ryan',      'Scott',     'ryan.scott@company.com',      'Sales', 69000.00),
  ('Hannah',    'Bell',      'hannah.bell@company.com',     'Sales', 77000.00),

  -- Operations
  ('George',    'Rivera',    'george.rivera@company.com',   'Operations', 66000.00),
  ('Mei',       'Zhang',     'mei.zhang@company.com',       'Operations', 63000.00),
  ('Caleb',     'Hughes',    'caleb.hughes@company.com',    'Operations', 61000.00),
  ('Zara',      'Ali',       'zara.ali@company.com',        'Operations', 64000.00);

INSERT INTO retired_teachers (first_name, last_name, teacher_id, subject, years_of_service, retirement_date, pension_start_date, monthly_pension, status) VALUES
  ('Eleanor', 'Marsh',     'TCH-001', 'Mathematics',        32, '2018-06-30', '2018-07-01', 3200.00, 'ACTIVE'),
  ('Harold',  'Stevens',   'TCH-002', 'English',            28, '2020-06-30', '2020-07-01', 2800.00, 'ACTIVE'),
  ('Dorothy', 'Chen',      'TCH-003', 'Science',            35, '2015-06-30', '2015-07-01', 3500.00, 'ACTIVE'),
  ('Walter',  'Hopkins',   'TCH-004', 'History',            22, '2019-06-30', '2019-07-01', 2200.00, 'ACTIVE'),
  ('Margaret','Liu',       'TCH-005', 'Art',                30, '2017-06-30', '2017-07-01', 3000.00, 'ACTIVE'),
  ('Frank',   'Wilson',    'TCH-006', 'Physical Education', 25, '2021-06-30', '2021-07-01', 2500.00, 'ACTIVE'),
  ('Helen',   'Kowalski',  'TCH-007', 'Music',              38, '2014-06-30', '2014-07-01', 3800.00, 'ACTIVE'),
  ('Raymond', 'Torres',    'TCH-008', 'Chemistry',          20, '2022-06-30', '2022-07-01', 2000.00, 'ACTIVE'),
  ('Edith',   'Campbell',  'TCH-009', 'Biology',            33, '2016-06-30', '2016-07-01', 3300.00, 'ACTIVE'),
  ('Bernard', 'Jackson',   'TCH-010', 'Computer Science',   18, '2023-06-30', '2023-07-01', 1800.00, 'ACTIVE'),
  ('Mildred', 'Garcia',    'TCH-011', 'Economics',          29, '2019-06-30', '2019-07-01', 2900.00, 'ACTIVE'),
  ('Arthur',  'Nguyen',    'TCH-012', 'Geography',          31, '2018-06-30', '2018-07-01', 3100.00, 'ACTIVE'),
  ('Lorraine','Murphy',    'TCH-013', 'Mathematics',        40, '2012-06-30', '2012-07-01', 4000.00, 'DECEASED'),
  ('Earl',    'Henderson', 'TCH-014', 'English',            26, '2020-06-30', '2020-07-01', 2600.00, 'SUSPENDED'),
  ('Phyllis', 'Baker',     'TCH-015', 'Science',            34, '2016-06-30', '2016-07-01', 3400.00, 'ACTIVE'),
  ('Norman',  'Price',     'TCH-016', 'History',            27, '2021-06-30', '2021-07-01', 2700.00, 'ACTIVE'),
  ('Gladys',  'Robinson',  'TCH-017', 'Physical Education', 21, '2022-06-30', '2022-07-01', 2100.00, 'ACTIVE'),
  ('Calvin',  'Peterson',  'TCH-018', 'Art',                36, '2013-06-30', '2013-07-01', 3600.00, 'DECEASED'),
  ('Ruth',    'Mitchell',  'TCH-019', 'Music',              24, '2020-06-30', '2020-07-01', 2400.00, 'ACTIVE'),
  ('Herbert', 'Collins',   'TCH-020', 'Chemistry',          39, '2011-06-30', '2011-07-01', 3900.00, 'SUSPENDED');
