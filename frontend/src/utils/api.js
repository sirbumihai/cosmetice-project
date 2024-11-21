import axios from "axios";

const apiUrl = "http://localhost:3000/auth/dashboard";

export const fetchData = async (table) => {
  try {
    const response = await axios.get(`${apiUrl}/${table}`);
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const insertData = async (table, data) => {
  try {
    const response = await axios.post(`${apiUrl}/${table}`, data);
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const updateData = async (table, id, data) => {
  try {
    const response = await axios.put(`${apiUrl}/${table}`, { id, ...data });
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const deleteData = async (table, id) => {
  try {
    await axios.delete(`${apiUrl}/${table}`, { data: { id } });
  } catch (err) {
    console.error(err);
  }
};