export const getResumeViewUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('/uploads/')) {
    return `http://localhost:8080${url}`;
  }
  return url;
};

export const getDownloadUrl = (url) => {
  if (!url) return '';
  const fullUrl = getResumeViewUrl(url);
  if (fullUrl.includes('/upload/') && !fullUrl.includes('/fl_attachment')) {
    return fullUrl.replace('/upload/', '/upload/fl_attachment:Resume/');
  }
  return fullUrl;
};
