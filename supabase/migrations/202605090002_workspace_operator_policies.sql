drop policy if exists "event operators create attendees" on public.event_attendees;
create policy "event operators create attendees"
on public.event_attendees for insert
to authenticated
with check (app_private.is_event_operator(event_id));

drop policy if exists "event operators delete attendees" on public.event_attendees;
create policy "event operators delete attendees"
on public.event_attendees for delete
to authenticated
using (app_private.is_event_operator(event_id));

drop policy if exists "event participants read event messages" on public.event_messages;
create policy "event participants read event messages"
on public.event_messages for select
to authenticated
using (app_private.is_event_participant(event_id));
