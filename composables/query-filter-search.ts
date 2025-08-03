export const useQueryFilterSearch = (query: string) => {
  
  const router = useRouter();

  let key = Object.keys(useRoute().query);
  let currentQuery = { ...useRoute().query };

  if (query.trim() != "") {
    if (key.includes("tag")) {
      router.push({
        query: {
          ...currentQuery,
          q: query,
        },
      });
    } else {
      router.push({
        query: {
          q: query,
        },
      });
    }
  } else {
    if (key.includes("tag")) {
      delete currentQuery.q;
      router.push({ query: { ...currentQuery } });
    } else {
      router.push({ query: {} });
    }
  }
};
