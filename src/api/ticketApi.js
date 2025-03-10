import axios from "axios";

const API_URL = "http://localhost:5000";

function getToken() {
  return localStorage.getItem("token");
}


export const fetchTickets = async () => {
  try {
    const response = await axios.get(`${API_URL}/tickets`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при загрузке тикетов:", error);
    return [];
  }
};

export const createTicket = async (ticketData) => {
  try {
    const response = await axios.post(`${API_URL}/tickets`, ticketData, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при создании тикета:", error);
    return null;
  }
};

export const getTicketById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/tickets/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении тикета:", error);
    return null;
  }
};

export const updateTicket = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/tickets/${id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при обновлении тикета:", error);
    return null;
  }
};

export const deleteTicket = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/tickets/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при удалении тикета:", error);
    return null;
  }
};

export const fetchSingleTicket = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/tickets/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    return response.data; 
  } catch (error) {
    console.error("Ошибка при получении тикета:", error);
    return null;
  }
};



// import axios from "axios";

// const API_URL = "https://dummyjson.com/users";

// export const fetchTickets = async () => {
//   try {
//     const response = await axios.get(API_URL);
//     return response.data.users.map((user) => ({
//       id: user.id,
//       status: user.eyeColor,
//       updated_at: user.birthDate,
//       subject: user.company?.title || "Нет данных",
//       department: user.company?.department || "Не указан",
//     }));
//   } catch (error) {
//     console.error("Ошибка при загрузке тикетов:", error);
//     return [];
//   }
// };