# Backend API contract

When `EXPO_PUBLIC_API_URL` is set, the app calls these endpoints. Request and response bodies are JSON, and their shapes match the TypeScript types in [`src/api/types.ts`](../src/api/types.ts). Every endpoint except sign-in receives `Authorization: Bearer <token>`.

A non-2xx response is treated as an error, and its body text is shown to the user, so keep error bodies short and readable.

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| POST | `/auth/sign-in` | `{ email, password }` | `Session` (`{ token, parent, schoolName }`) |
| GET | `/children` | — | `Child[]`: children linked to the signed-in parent |
| GET | `/children/:childId/progress` | — | `Progress` for the current term |
| GET | `/reports?childId=:childId` | — | `ReportCard[]`, newest first |
| GET | `/reports/:id` | — | `ReportCard` |
| GET | `/announcements` | — | `Announcement[]` |
| GET | `/feedback` | — | `Feedback[]`: this parent's threads, most recently updated first |
| GET | `/feedback/:id` | — | `Feedback` with all messages |
| POST | `/feedback` | `NewFeedback` | the created `Feedback` |
| POST | `/feedback/:id/messages` | `{ body }` | the updated `Feedback` |

## Notes for the school side

- `Feedback.type` is one of `complaint`, `suggestion`, `appreciation` or `report`. Report feedback also carries `reportId` and a `rating` from 1 to 5.
- When `anonymous` is true, don't show the parent's identity to staff. The server should still record who sent it, for abuse handling.
- Staff replies are added as messages with `from: "school"`, and staff move `status` through `submitted → in_review → resolved | closed`. Parents can't reply once a thread is `closed`.
- The server must only return children, reports and feedback that belong to the authenticated parent.
