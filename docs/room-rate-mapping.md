# Hotel room photographs and rates

Source: `Our rooms/Room Rates.docx`, supplied by the user. The PRD specifies price per night; that basis is used for display. The rate sheet does not specify tax treatment, breakfast or other inclusions, validity dates, or occupancy. Those details remain unconfirmed.

| Website room | Source category | Nightly rate | Source photograph |
| --- | --- | --- | --- |
| Standard Room | STANDARD ROOM | GH¢450.00 | Single Standard.jpg |
| Standard Double | STANDARD DOUBLE | GH¢650.00 | Double Standard.jpg |
| Deluxe Room | DELUX | GH¢750.00 | Deluxe.jpg |
| Executive Room | EXECUTIVE | GH¢850.00 | Executive Suite Room.jpg |
| Suite | SUITE | GH¢1,050.00 | No separate photograph supplied |

The Executive Suite Room filename is ambiguous because the sheet lists EXECUTIVE and SUITE separately. It is mapped to Executive, matching the leading category in its filename, and the separate Suite card uses an explicit photo-pending state. Do not duplicate this image or present a stock photo as the separate Suite. The conference room photograph is not a bedroom and is not assigned to a room rate.

Source images are copied unchanged to `public/images/rooms/`. Originals remain in `Our rooms/`. Next.js handles responsive optimization. Actual hotel photographs are labeled as hotel photographs; other pages retain separately labeled illustrative stock images.

`src/data/rooms.ts` is the single source for category names, photos, and rates, shared by the full Rooms collection, homepage featured cards, and booking selection/summary. Prices are stored as integer Ghana pesewas. `src/lib/rates.ts` formats GHS and multiplies nightly price by nights without per-guest multiplication. Booking estimates exclude unconfirmed taxes/fees and do not reserve rooms or collect payment.

The earlier mock Presidential Suite and invented room capacities are not part of the supplied catalog. The collection now has five categories, a nightly-budget filter, category filters, and name search. Occupancy remains null until verified; the booking form retains its existing party-size selector without enforcing fabricated per-room limits.

The production-readiness report and Lighthouse scores from the previous audit describe that prior build. This content update receives its own build, route, unit, and targeted browser checks; it does not imply that the entire historic audit was rerun.
