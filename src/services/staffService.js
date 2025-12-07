// /src/services/staffService.js

// Fake DB
let STAFFS = [
  {
    id: "1",
    name: "Nguyen Van A",
    email: "a@company.com",
    phone: "0901234567",
    role: "Manager",
  },
  {
    id: "2",
    name: "Tran Thi B",
    email: "b@company.com",
    phone: "0939876543",
    role: "Staff",
  },
  {
    id: "3",
    name: "Pham Minh C",
    email: "c@company.com",
    phone: "0912233445",
    role: "Cleaner",
  },
  {
    id: "4",
    name: "Le Hoang D",
    email: "d@company.com",
    phone: "0988877665",
    role: "Driver",
  },
];

export const getAllStaff = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(STAFFS), 300); // mô phỏng delay API
  });
};

export const updateStaff = async (id, updatedData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      STAFFS = STAFFS.map((s) => (s.id === id ? { ...s, ...updatedData } : s));
      resolve(true);
    }, 200);
  });
};

export const deleteStaff = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      STAFFS = STAFFS.filter((s) => s.id !== id);
      resolve(true);
    }, 200);
  });
};
