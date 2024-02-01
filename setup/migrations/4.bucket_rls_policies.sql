-- Images

CREATE POLICY "Give users access to own folder - INSERT" ON storage.objects
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK ((bucket_id = 'images'::text) AND ((auth.uid())::text = (storage.foldername(name))[1]));

CREATE POLICY "Give users access to own folder - UPDATE" ON storage.objects
AS PERMISSIVE FOR UPDATE
TO authenticated
USING ((bucket_id = 'images'::text) AND ((auth.uid())::text = (storage.foldername(name))[1]));

CREATE POLICY "Give users access to own folder - DELETE" ON storage.objects
AS PERMISSIVE FOR DELETE
TO authenticated
USING ((bucket_id = 'images'::text) AND ((auth.uid())::text = (storage.foldername(name))[1]));