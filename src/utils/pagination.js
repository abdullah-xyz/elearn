function paginate(items, page, itemsInPage) {
  const count = items.length;
  if ((page - 1) * itemsInPage > count) {
    throw new Error("not enough items");
  }
  const paginated = items.slice((page - 1) * itemsInPage, page * itemsInPage);
  return { items: paginated, pages: Math.ceil(count / itemsInPage) };
}

module.exports = paginate;
