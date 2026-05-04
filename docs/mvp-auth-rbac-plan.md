# Athlon Agent MVP: Unified Auth + Role-Based Access

## Product direction (MVP)
Build **one shared system** with one login/signup flow and role-based access controls. Avoid separate athlete/agent apps.

### MVP roles
- `athlete`
- `agent`
- `agency_admin`

> Future roles (not in MVP): `assistant`, `brand_manager`, `parent`, `coach`.

## User flow
1. **Landing page**
   - CTA: `Sign in` and `Get started`
2. **Sign up**
   - Collect: name, email, password, role (`Athlete` or `Agent`)
   - Agent path:
     - Create new agency, or
     - Join existing agency via invite
   - Athlete path:
     - Join via invite, or
     - Create account and wait to be linked
3. **Login**
   - Shared login page for all users
   - Redirect by role:
     - `athlete` → `/athlete/dashboard`
     - `agent` → `/agent/dashboard`
     - `agency_admin` → `/agency/dashboard`
4. **Permission gate**
   - Before data render, always resolve:
     - role
     - agency membership
     - athlete relationship/assignment
     - permission level

## Database model (clean MVP core)

### 1) `users` (auth identity)
- `id`
- `email`
- `password_hash` OR provider id
- `created_at`

### 2) `profiles` (account metadata)
- `id`
- `user_id` (FK `users.id`)
- `full_name`
- `role`
- `phone`
- `profile_photo`
- `created_at`

### 3) `agencies`
- `id`
- `name`
- `owner_user_id`
- `logo`
- `plan_type`
- `created_at`

### 4) `agency_members`
- `id`
- `agency_id` (FK `agencies.id`)
- `user_id` (FK `users.id`)
- `member_role` (`agency_admin`, `agent`, `assistant`)
- `permissions` (json)
- `created_at`

### 5) `athletes`
- `id`
- `user_id` (FK `users.id`)
- `primary_agency_id` (FK `agencies.id`)
- `sport`
- `school`
- `year`
- `social_links` (json)
- `nil_value_estimate`
- `created_at`

### 6) `agent_athlete_relationships`
- `id`
- `athlete_id` (FK `athletes.id`)
- `agency_id` (FK `agencies.id`)
- `agent_user_id` (FK `users.id`)
- `relationship_type` (`lead_agent`, `support_agent`, `scout`)
- `status` (`active`, `pending`, `archived`)
- `created_at`

## Feature tables for MVP

### 7) `tasks`
- `id`, `title`, `description`
- `assigned_to_user_id`, `created_by_user_id`
- `athlete_id`, `agency_id`
- `due_date`, `status`, `priority`, `created_at`

### 8) `deals`
- `id`, `athlete_id`, `agency_id`
- `title`, `brand_name`, `value`, `status`
- `start_date`, `end_date`
- `notes`, `created_by_user_id`, `created_at`

### 9) `events`
- `id`, `athlete_id`, `agency_id`
- `title`, `event_type`
- `start_time`, `end_time`, `location`
- `visibility`, `created_by_user_id`, `created_at`

### 10) `documents`
- `id`, `athlete_id`, `agency_id`
- `uploaded_by_user_id`
- `file_url`, `file_type`, `title`
- `visibility` (`athlete_only`, `agency_only`, `shared`)
- `created_at`

### 11) `notifications`
- `id`, `user_id`
- `title`, `body`, `type`
- `read_status`, `link`, `created_at`

## Access matrix (MVP)

### Athlete
Can:
- View own profile
- View own tasks/events/deals/documents (or explicitly shared)
- Update allowed profile fields

Cannot:
- View other athletes
- View agency private notes
- Manage team, billing, or permissions

### Agent
Can:
- View assigned athletes
- Create/edit tasks, deals, events, documents for assigned athletes

Cannot (unless admin):
- Billing
- Full agency settings
- Staff-wide permission management

### Agency admin
- Full agency access, including invites, team management, permissions, billing

## Routing and authorization pattern

### Auth redirect (coarse)
1. Authenticate user
2. Read profile + role
3. Read agency membership
4. Route to role home

### Page-level guard (fine-grained)
Every route should independently enforce access rules. Do not rely only on login redirect.

## MVP screens

### Public
- Landing
- Pricing
- Sign in
- Sign up
- Forgot password

### Athlete
- Dashboard
- Tasks
- Calendar
- Deals
- Documents
- Profile/settings

### Agent
- Dashboard
- Athlete roster
- Athlete detail
- Tasks
- Deals
- Calendar
- Documents
- Settings

### Agency admin
- Agency settings
- Team members
- Invite users
- Billing

## Implementation mindset

### Frontend
- One auth flow
- Role-based routing
- Role-specific layouts/dashboards

### Backend
- Shared database
- Relationship-driven permissions
- Agency membership model

### Security
- Enforce row-level authorization
- Athletes can only query rows tied to self
- Agents can only query rows tied to their agency + assignments

## Recommended stack for this architecture
Supabase fits this model well:
- Built-in auth
- Postgres schema flexibility
- Strong row-level security support

## Anti-pattern to avoid
Do **not** create separate athlete and agent apps with duplicated auth/data models. It increases maintenance and creates sync bugs.

## Delivery phases

### Phase 1
- Shared login/signup
- Role selection
- Athlete dashboard
- Agent dashboard
- Agency creation
- Invite athlete
- Tasks, deals, calendar, file uploads

### Phase 2
- Multi-staff agency support
- Advanced permissions
- Athlete messaging
- Analytics
- Billing tiers

### Phase 3
- Contract workflows
- Parent accounts
- Brand portals
- AI NIL valuation
- Automations
