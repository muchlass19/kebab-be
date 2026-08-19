export const getStorageUrl = (key: string | null | undefined) => {
  if (!key) return "";

  return `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_REGION}.digitaloceanspaces.com/${key}`;
};
