-- Этап 3. handle_new_user нужна только триггеру on_auth_user_created.
-- Закрываем прямой вызов через REST API (rpc) ролями anon/authenticated/public.
revoke execute on function public.handle_new_user() from anon, authenticated, public;
