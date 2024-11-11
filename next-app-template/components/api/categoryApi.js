// api/categoryApi.js

export const fetchCategories = async () => {
  const response = await fetch('http://localhost:5001/api/categories');
  return response.json();
};

export const addCategory = async (categoryName) => {
  const response = await fetch('http://localhost:5001/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: categoryName }),
  });
  return response.json();
};

export const addSubcategory = async (categoryId, subcategoryName) => {
  const response = await fetch(`http://localhost:5001/api/categories/${categoryId}/subcategories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: subcategoryName }),
  });
  return response.json();
};
