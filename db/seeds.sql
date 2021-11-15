INSERT INTO department (name)
VALUES  ('Finance'),
        ('Technology'),
        ('Sales');

INSERT INTO role (title,salary,department_id)
VALUES  ('Manager',11000.00, 1),
        ('Account Manager',22.22,3),
        ('IT Support',333.33,2),
        ('Developer',44.44,2),
        ('Sales Representative',555.55,3);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES  ('Sarah', 'Planental',1,NULL),
        ('Joe', 'Junior',5,1),
        ('Otto', 'Guy',1,NULL),
        ('Stuart', 'Little',3,3);