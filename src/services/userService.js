const API_BASE_URL = "http://localhost:8080/api/customers";

/**
 * BE → FE mapping theo đúng entity
 */
const mapCustomer = (c) => ({
  id: c.customerId,
  name: c.name,
  email: c.email,
  phone: c.phone,
  address: c.address,
  loyaltyTier: c.loyaltyTier,
});

/**
 * GET active customers
 */
export const getAllUsers = async () => {
  const res = await fetch(`${API_BASE_URL}/active`);
  if (!res.ok) throw new Error("Failed to fetch customers");

  const json = await res.json();
  return json.data.map(mapCustomer);
};

/**
 * POST create customer
 */
export const addUser = async (newUser) => {
  const payload = {
    name: newUser.name,
    email: newUser.email,
    phone: newUser.phone,
    address: newUser.address,
    loyaltyTier: newUser.loyaltyTier,
  };

  const res = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to add customer");
  const json = await res.json();
  return mapCustomer(json.data);
};

/**
 * PUT update customer
 */
export const updateUser = async (id, updatedUser) => {
  const payload = {
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    address: updatedUser.address,
    loyaltyTier: updatedUser.loyaltyTier,
  };

  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update customer");

  const json = await res.json();
  return mapCustomer(json.data);
};

/**
 * DELETE (soft delete)
 */
export const deleteUser = async (id) => {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete customer");

  return true;
};

/**
 * SEARCH keyword
 */
export const searchUser = async (keyword) => {
  const res = await fetch(`${API_BASE_URL}/search?keyword=${keyword}`);

  if (!res.ok) throw new Error("Search failed");

  const json = await res.json();
  return json.data.map(mapCustomer);
};

/**
 * GET deleted customers
 */
export const getDeletedUsers = async () => {
  const res = await fetch(`${API_BASE_URL}/deleted`);
  if (!res.ok) throw new Error("Failed to fetch deleted customers");

  const json = await res.json();
  return json.data.map(mapCustomer);
};

/**
 * RESTORE a deleted customer
 */
export const restoreUser = async (id) => {
  const res = await fetch(`${API_BASE_URL}/${id}/restore`, {
    method: "PUT",
  });

  if (!res.ok) throw new Error("Failed to restore customer");
  return true;
};
