interface ProductCategoriesProps {
  main_categories?: string[];
  sub_categories?: string[] | null;
}

export const ProductCategories = ({
  main_categories,
  sub_categories,
}: ProductCategoriesProps) => {
  return (
    <>
      <div className="mt-8">
        <h3 className="font-semibold mb-4 text-primary">Categorías</h3>
        <div className="flex flex-wrap gap-2">
          {main_categories?.map((category: string) => (
            <span
              key={category}
              className="px-3 py-1 rounded-full text-sm bg-gradient-to-r from-primary/10 to-accent/10 text-primary hover:from-primary/20 hover:to-accent/20 transition-colors"
            >
              {category}
            </span>
          ))}
        </div>
      </div>

      {sub_categories && sub_categories.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-4 text-primary">Subcategorías</h3>
          <div className="flex flex-wrap gap-2">
            {sub_categories.map((subcategory: string) => (
              <span
                key={subcategory}
                className="px-3 py-1 rounded-full text-sm bg-gradient-to-r from-accent/10 to-primary/10 text-accent hover:from-accent/20 hover:to-primary/20 transition-colors"
              >
                {subcategory}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
};