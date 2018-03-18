USE bamazon

SELECT * FROM departments

INSERT INTO departments (department_name, over_head_costs)
VALUES ("sports", 2000), ("clothing", 3000), ("electronics", 4000), ("home goods", 1500)

SELECT departments.department_name, departments.id, departments.over_head_costs, products.product_sales
FROM departments
INNER JOIN products ON products.department_name = departments.department_name