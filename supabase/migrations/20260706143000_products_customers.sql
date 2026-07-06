-- Products
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  unit_price numeric(10,2) NOT NULL DEFAULT 0,
  unit text,
  sku text,
  category text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth all products" ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_products_active ON public.products(active);

-- Customers
CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  billing_address text,
  vat_number text,
  contact_person text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated;
GRANT ALL ON public.customers TO service_role;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth all customers" ON public.customers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_customers_updated BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE UNIQUE INDEX idx_customers_name ON public.customers(lower(name));

-- Link documents to a customer record (keep existing customer_* snapshot fields as-is)
ALTER TABLE public.documents ADD COLUMN customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL;
CREATE INDEX idx_documents_customer ON public.documents(customer_id);

-- Link line items to a product record (optional — preserves historical price if product changes later)
ALTER TABLE public.line_items ADD COLUMN product_id uuid REFERENCES public.products(id) ON DELETE SET NULL;
