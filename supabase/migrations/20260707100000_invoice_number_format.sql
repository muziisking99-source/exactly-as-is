-- Invoice numbers use INV-1703 format (sequential, no year)
CREATE OR REPLACE FUNCTION public.generate_doc_number(p_doc_type text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_prefix text;
  v_year text := to_char(now(), 'YYYY');
  v_max int;
  v_next int;
BEGIN
  IF p_doc_type = 'invoice' THEN
    SELECT COALESCE(MAX(CAST(split_part(doc_number, '-', 2) AS int)), 1702)
      INTO v_max
      FROM public.documents
      WHERE doc_type = 'invoice' AND doc_number ~ '^INV-[0-9]+$';
    v_next := v_max + 1;
    RETURN 'INV-' || v_next::text;
  END IF;

  v_prefix := CASE p_doc_type
    WHEN 'quote' THEN 'QT'
    WHEN 'delivery_note' THEN 'DN'
    WHEN 'job_card' THEN 'JC'
    ELSE 'DOC' END;
  SELECT COALESCE(MAX(CAST(split_part(doc_number, '-', 3) AS int)), 0)
    INTO v_max
    FROM public.documents
    WHERE doc_type = p_doc_type AND doc_number LIKE v_prefix || '-' || v_year || '-%';
  v_next := v_max + 1;
  RETURN v_prefix || '-' || v_year || '-' || lpad(v_next::text, 4, '0');
END; $$;
