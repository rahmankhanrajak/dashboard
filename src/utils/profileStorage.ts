export const saveProfile = (profile: any) => {
  localStorage.setItem("userProfile", JSON.stringify(profile));
};

export const loadProfile = () => {
  const data = localStorage.getItem("userProfile");
  return data ? JSON.parse(data) : null;
};
