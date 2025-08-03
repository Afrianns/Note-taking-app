import type { Router } from "vue-router";
import type { LocationQueryValue } from "vue-router";

export const useQueryFilterTag = (name: string) => {
  const router = useRouter();
  let key = Object.keys(useRoute().query);
  let currentQuery = { ...useRoute().query };

  if (key.includes("q")) {
    if (!key.includes("tag")) {
      // Add the tag
      router.push({
        query: {
          ...currentQuery,
          tag: name,
        },
      });
    } else {
      toggleQuery(router, currentQuery, name);
    }
  } else {
    toggleQuery(router, currentQuery, name);
  }
};

const toggleQuery = (
  router: Router,
  currentQuery: { [x: string]: LocationQueryValue | LocationQueryValue[] },
  name: string
) => {
  if (currentQuery.tag === name) {
    // Toggle off: remove tag if it's the same
    delete currentQuery.tag;
    router.push({ query: currentQuery });
  } else {
    // Replace with new tag
    currentQuery.tag = name;
    router.push({ query: currentQuery });
  }
};
