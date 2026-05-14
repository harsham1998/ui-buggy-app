# QA Bug Answer Key
**CONFIDENTIAL — Interviewer Use Only**

---

## Global Bugs (present across all pages)

| # | Bug | How to Find | Expected | Actual |
|---|-----|-------------|----------|--------|
| G1 | Toast success = red color | Submit any valid form — see success notification | Green toast | Red toast |
| G2 | Toast error = green color | Submit incomplete form — see error notification | Red toast | Green toast |
| G3 | Info tooltip on E-commerce page describes Hotel page | Hover ℹ on Page 3 (E-Commerce) | "Browse products, add to cart..." | "Book a hotel room by selecting dates..." |
| G4 | "Back to Home" link broken on Restaurant page | Click ← Home on Page 6 | Goes to home | Goes to ../../index.html (404) |
| G5 | Browser tab title mismatch — Hotel page | Open Page 2 in browser, check tab title | "Hotel — Room Booking" | "Hotel Booking System" |
| G6 | Browser tab title mismatch — School page | Open Page 7 in browser, check tab title | "School — Student Enrollment" | "Banking — Account Opening" |

---

## Page 1 — Hospital: Patient Registration

| # | Tier | Bug | How to Reproduce | Expected | Actual |
|---|------|-----|-----------------|----------|--------|
| 1 | Easy | "Full Name" field labeled "Last Name" | Look at first form field | Label: "Full Name" | Label: "Last Name" |
| 2 | Easy | Broken logo image in header | Look at page header | Hospital logo visible | Broken image (404) |
| 3 | Easy | Invalid blood group "C+" in dropdown | Open Blood Group dropdown | Options: A+, A-, B+, B-, O+, O-, AB+, AB- | Includes "C+" |
| 4 | Easy | "Other" gender radio is misaligned | View Gender field | Three radio options aligned horizontally | "Other" is displaced below and left |
| 5 | Medium | Appointment date allows past dates | Click appointment date, select yesterday | Only today or future allowed | Past dates accepted |
| 6 | Medium | Doctor dropdown not filtered by department | Select "Cardiology", check doctor list | Only Cardiology doctors shown | All doctors always shown |
| 7 | Medium | Auto-calculated age is off by 1 year | Enter a DOB, note the age field | Correct current age | Age + 1 |
| 8 | Medium | Form submits without emergency phone | Leave emergency phone blank, submit | Validation error | Form submits successfully |
| 9 | Medium | File upload accepts all types despite "PDF only" hint | Click Upload ID Proof, try uploading .jpg | Only .pdf accepted | All file types accepted |
| 10 | Hard | API returns 500 on valid submission | Fill all fields correctly, submit, check Network tab | 201 Created | 500 Internal Server Error |
| 11 | Hard | Registered patients list always empty | Submit a patient, check the list below | Patient appears in list | List stays empty (localStorage key mismatch: saves "patientData", reads "patients") |
| 12 | Hard | Insurance toggle state resets on page reload | Enable insurance, reload page | Toggle remains ON | Toggle resets to OFF |
| 13 | Hard | Appointment time missing from API request | Submit form, inspect Network payload | appointmentTime included | appointmentTime absent from request body |

---

## Page 2 — Hotel: Room Booking

| # | Tier | Bug | How to Reproduce | Expected | Actual |
|---|------|-----|-----------------|----------|--------|
| 1 | Easy | Hotel logo stretched/distorted | View page header | Properly sized logo | Logo is stretched horizontally |
| 2 | Easy | "Number of Children" labeled "Number of Adults" | Look at guest count fields | Two distinct labels | Both fields labeled "Number of Adults" |
| 3 | Easy | Bed preference radio options don't wrap | Narrow browser window | Options wrap or stack | Options overflow/clip horizontally |
| 4 | Easy | "Suite" spelled "Swite" in dropdown | Open Room Type dropdown | Option: "Suite" | Option: "Swite" |
| 5 | Medium | Checkout date allows dates before check-in | Set check-in as today, set checkout to yesterday | Validation error | No error, booking proceeds |
| 6 | Medium | Deluxe room price calculation uses Standard rate | Select Deluxe, enter 1 night | Total = ₹5,000 | Total = ₹3,000 |
| 7 | Medium | Valid promo code "SAVE10" always shows "Invalid" | Enter promo code "SAVE10", click Apply | "10% discount applied" | "Invalid promo code" |
| 8 | Medium | "Pool" amenity checkbox always disabled | View Amenities section | All options selectable | Pool is greyed out, cannot select |
| 9 | Medium | Number of nights is off by 1 | Book 2-night stay (e.g., Mon to Wed) | 2 nights | 3 nights |
| 10 | Hard | API returns 200 with error body on valid booking | Submit valid booking, check Network response body | `{"bookingId": "..."}` | `{"status": "error", "message": "..."}` |
| 11 | Hard | Star rating not included in API payload | Rate 4 stars, submit, inspect Network | `rating: 4` in request | Rating field absent from payload |
| 12 | Hard | Booking list always empty | Make a booking, scroll down | Booking appears in history | List is always empty (saves "hotelBooking", reads "bookings") |
| 13 | Hard | Nationality field not validated — blank accepted | Leave nationality blank, submit | Validation error | Form submits with blank nationality |

---

## Page 3 — E-Commerce: Product Order

| # | Tier | Bug | How to Reproduce | Expected | Actual |
|---|------|-----|-----------------|----------|--------|
| 1 | Easy | Cart badge always shows 0 | Add any product to cart | Badge shows item count | Badge always shows 0 |
| 2 | Easy | Pincode accepts letters | Type "ABCDEF" in Pincode field | Only numbers accepted | Letters accepted |
| 3 | Easy | "Place Order" button floats outside form container | Scroll to bottom of form | Button inside/aligned to form | Button floats right, outside container |
| 4 | Medium | Product search is case-sensitive | Search "shirt" (lowercase) | Finds "T-Shirt", "Denim Jeans" | No results |
| 5 | Medium | Category filter clears search text | Type "shoes" in search, then select a category | Search text preserved | Search box is cleared |
| 6 | Medium | Quantity + button adds 2 instead of 1 | Add item to cart, click + | Quantity increases by 1 | Quantity increases by 2 |
| 7 | Medium | Tax shown as "5% GST" but calculated at 18% | Add ₹1000 item, check tax | ₹50 (5%) | ₹180 (18%) |
| 8 | Medium | Coupon "DISC20" applies 10% not 20% | Enter coupon DISC20, apply | 20% discount | 10% discount |
| 9 | Medium | Card number field stays visible when COD selected | Select COD payment method | Card field hidden | Card field remains visible |
| 10 | Hard | API returns 201 even for empty cart | Submit order with empty cart, check Network | 400 Bad Request | 201 Created |
| 11 | Hard | Delivery date allows past dates | Select delivery date in the past | Only future dates | Past dates accepted |
| 12 | Hard | Cart total doesn't update after item removal | Add 2 items, remove one, check totals | Totals recalculate | Totals show stale value |
| 13 | Hard | Order history always empty | Place an order, scroll to history | Order appears | Empty (saves "orders", reads "orderHistory") |

---

## Page 4 — HR: Employee Onboarding

| # | Tier | Bug | How to Reproduce | Expected | Actual |
|---|------|-----|-----------------|----------|--------|
| 1 | Easy | Work Email field labeled "Personal Email" (duplicate) | View Contact Information section | Two distinct labels | Both email fields labeled "Personal Email" |
| 2 | Easy | HR department logo missing from header | Look at page header | HR/company logo | Empty grey box |
| 3 | Easy | Employee ID auto-generates with letters despite hint | View Employee ID field | Placeholder: "Numbers only"; numeric ID | Alphanumeric ID like "EMP3X7K2" |
| 4 | Easy | Profile photo preview is upside-down | Upload any photo | Photo displays correctly | Photo shows upside-down (180° rotation) |
| 5 | Medium | Start date allows past dates | Select a date 1 year ago | Only today or future | Past dates accepted |
| 6 | Medium | DOB allows future dates | Set DOB to next year | Past dates only | Future dates accepted |
| 7 | Medium | Removing one skill tag removes all tags | Add 3 skills, click × on one | Only that skill removed | All skills cleared |
| 8 | Medium | "Contract" employment type is missing | View Employment Type options | Full-time, Part-time, Contract | Only Full-time and Part-time |
| 9 | Medium | Success toast shows for 10 seconds | Submit valid form | Toast disappears after 3s | Toast stays for 10 seconds |
| 10 | Hard | API returns 400 with empty response body | Trigger a validation failure, inspect response | JSON error message | Empty response body |
| 11 | Hard | Background Check Consent not required | Leave consent unchecked, submit | Validation error | Form submits |
| 12 | Hard | Salary saved as string not number | Submit employee, inspect localStorage | `salary: 800000` (number) | `salary: "800000"` (string) |
| 13 | Hard | Laptop Required toggle value is inverted | Enable laptop toggle, inspect payload | `laptopRequired: true` | `laptopRequired: false` |

---

## Page 5 — Flight: Ticket Booking

| # | Tier | Bug | How to Reproduce | Expected | Actual |
|---|------|-----|-----------------|----------|--------|
| 1 | Easy | Airline logo alt text says "Hotel Logo" | Inspect img element in header | alt="Airline Logo" | alt="Hotel Logo" |
| 2 | Easy | "From" and "To" fields are swapped | View the two route fields | From = Origin, To = Destination | Field labels are reversed |
| 3 | Easy | Seat "Middle" option labeled "Center" | View Seat Preference radio buttons | "Middle" | "Center" |
| 4 | Easy | "First Class" spelled "Frist Class" | Open Class dropdown | "First Class" | "Frist Class" |
| 5 | Medium | Return Date shows and is required for One-way | Select "One-way" trip type | Return Date hidden | Return Date visible and required |
| 6 | Medium | Departure date allows yesterday | Click departure date calendar | Yesterday disabled | Yesterday selectable |
| 7 | Medium | 0 passengers is allowed | Set Passengers to 0, submit | Validation: min 1 | Submitted with 0 passengers |
| 8 | Medium | Baggage weight sent in lbs not kg | Toggle baggage on, set to 10 kg, inspect payload | `baggageWeight: 10` (kg) | `baggageWeight: 22 lbs` |
| 9 | Medium | Toast disappears instantly (0ms) | Submit form — watch toast | Toast visible ~3 seconds | Toast flashes and disappears immediately |
| 10 | Hard | Expired passport accepted | Enter a passport expiry date in the past | Validation error | Accepted |
| 11 | Hard | Round-trip return date can be before departure | Set return before departure date | Validation error | No error |
| 12 | Hard | API returns 404 for flight booking | Submit flight, check Network tab | 201 Created | 404 Not Found (API at /api/flights, called as /api/flight) |
| 13 | Hard | Meal preference missing from API payload | Select Vegan meal, submit, inspect Network | `mealPref: "Vegan"` in request | Field absent from payload |
| 14 | Hard | Travel insurance stored as "on" string not boolean | Check insurance, submit, inspect payload | `travelInsurance: true` | `travelInsurance: "on"` |

---

## Page 6 — Restaurant: Reservation

| # | Tier | Bug | How to Reproduce | Expected | Actual |
|---|------|-----|-----------------|----------|--------|
| 1 | Easy | Restaurant logo overlaps page title | View the header | Logo beside title | Logo sits on top of title text |
| 2 | Easy | Party size slider goes to 20 despite label saying 1-12 | Drag party size slider to maximum | Max = 12 | Max = 20 |
| 3 | Easy | Outdoor seating has no icon | View Seating Preference options | 🌿 or similar icon | No icon for Outdoor |
| 4 | Easy | "Casual" spelled "Casuel" in Occasion dropdown | Open Occasion dropdown | "Casual" | "Casuel" |
| 5 | Medium | Reservation date allows past dates | Select a past date | Only future dates | Past dates accepted |
| 6 | Medium | Party size of 0 accepted on submit | Set slider to minimum (1), but submit with value 0 if possible | Min 1 enforced | 0 accepted |
| 7 | Medium | Selecting "Vegan" deselects "Vegetarian" | Check Vegetarian, then check Vegan | Both can be selected | Vegetarian is automatically unchecked |
| 8 | Medium | Promo code field not cleared after applying | Enter code DINE15, click Apply Promo | Field cleared | Old code remains in field |
| 9 | Medium | Toast appears behind form elements | Submit form, look at toast position | Toast on top of everything | Toast appears behind form |
| 10 | Hard | Reservation time missing from API payload | Set time to 7:30 PM, submit, inspect Network | `resTime: "19:30"` in payload | Field absent |
| 11 | Hard | Estimated spend slider sends value + 10 | Set slider to $50, submit, inspect payload | `estimatedSpend: 50` | `estimatedSpend: 60` |
| 12 | Hard | API accepts party size exceeding venue capacity | Submit with 15 guests, check Network response | 400 error for over capacity | 200 OK accepted |
| 13 | Hard | SMS toggle makes phone number no longer required | Enable SMS notifications, remove phone, submit | Phone required for SMS | Form submits without phone |
| 14 | Hard | Star rating resets after successful submit | Rate 4 stars, submit, see stars after success | Stars retain value | Stars reset to 0 |

---

## Page 7 — School: Student Enrollment

| # | Tier | Bug | How to Reproduce | Expected | Actual |
|---|------|-----|-----------------|----------|--------|
| 1 | Easy | School logo broken (404) | View page header | School crest/logo | Broken image |
| 2 | Easy | Parent Email field labeled "Student Email" | View Parent Details section | Label: "Parent Email" | Label: "Student Email" |
| 3 | Easy | Grade dropdown starts at "Grade 0" | Open Grade dropdown | Starts at Grade 1 | First option is Grade 0 |
| 4 | Easy | Fee Amount field is editable | Click on Fee Amount field | Read-only / greyed out | Field is editable |
| 5 | Medium | Student DOB allows future dates | Set DOB to next year | Past dates only | Future dates accepted |
| 6 | Medium | Fee doesn't update when grade changes | Select Grade 1, note fee; change to Grade 12 | Fee updates to match grade | Fee stays at 0 |
| 7 | Medium | More than 3 courses can be selected | Select 4+ courses | Max 3 enforced | 4+ courses selectable, no error |
| 8 | Medium | "A" grade missing from Previous Academic Grade dropdown | Open Previous Grade dropdown | A, B, C, D, F | Only B, C, D, F |
| 9 | Medium | Terms & Conditions checkbox not required | Leave terms unchecked, submit | Validation error | Form submits |
| 10 | Medium | File upload only accepts images despite "PDF, DOC" hint | Click Upload Birth Certificate, try PDF | PDF accepted | Only images allowed |
| 11 | Hard | API returns 500 on valid enrollment | Fill form correctly, submit, check Network | 201 Created | 500 Internal Server Error |
| 12 | Hard | Enrollment date allows future dates | Set enrollment date to next year | Current academic year or prior | Future dates accepted |
| 13 | Hard | Cheque payment provides no cheque number field | Select Cheque payment, submit | Cheque number field appears | No extra field; API receives no cheque number |
| 14 | Hard | New enrollment overwrites previous record | Enroll student A, then enroll student B, check list | Both students in list | Only student B shows (overwrite) |

---

## Page 8 — Banking: Account Opening

| # | Tier | Bug | How to Reproduce | Expected | Actual |
|---|------|-----|-----------------|----------|--------|
| 1 | Easy | Bank logo misaligned (centered instead of left) | View page header | Logo left-aligned | Logo centered over header |
| 2 | Easy | PAN Number field placeholder says "Enter Aadhaar" | View PAN Number field | Placeholder: "ABCDE1234F" | Placeholder: "Enter Aadhaar" |
| 3 | Easy | "Father" appears twice in Nominee Relationship dropdown | Open Nominee Relationship dropdown | Each option once | "Father" listed twice |
| 4 | Easy | "Fixed Deposit" displayed as "FX Dep" | Open Account Type dropdown | "Fixed Deposit" | "FX Dep" |
| 5 | Medium | PAN format not validated | Enter "12345" as PAN, submit | Validation: must match ABCDE1234F | Accepted |
| 6 | Medium | Aadhaar accepts less than 12 digits | Enter "1234" as Aadhaar | Validation: exactly 12 digits | Accepted |
| 7 | Medium | Initial deposit allows ₹1 despite hint saying ₹500 minimum | Enter ₹1 as deposit, submit | Validation: min ₹500 | Accepted |
| 8 | Medium | Nominee DOB allows future dates | Set nominee DOB to next year | Past dates only | Future dates accepted |
| 9 | Medium | Joint mode shows no second applicant section | Select "Joint" mode of operation | Second applicant form appears | Nothing changes |
| 10 | Hard | Declaration checkbox not required | Leave declaration unchecked, submit | Validation error | Form submits |
| 11 | Hard | API returns 201 with no application ID | Submit form, check Network response | `{"applicationId": "...", "message": "..."}` | `{"message": "Application submitted"}` — no ID |
| 12 | Hard | Net Banking toggle not in API payload | Enable net banking, submit, inspect Network | `netBanking: true` | Field absent from payload |
| 13 | Hard | Applicant age not validated (can be under 18) | Set DOB to make age 10, submit | Validation: must be 18+ | Accepted |

---

## Page 9 — Real Estate: Property Listing

| # | Tier | Bug | How to Reproduce | Expected | Actual |
|---|------|-----|-----------------|----------|--------|
| 1 | Easy | All property type icons are the same (🏠) | Open Property Type dropdown | Different icons for each type | All show 🏠 |
| 2 | Easy | "Bedrooms" field labeled "Bathrooms" | View property details section | First count field = "Bedrooms" | First field labeled "Bathrooms" |
| 3 | Easy | Price field shows $ symbol in INR context | View Price field | ₹ symbol or INR label | $ symbol |
| 4 | Medium | Price per Sqft calculated using bedrooms not area | List a 1000 sqft property at ₹5,000,000 with 3 BHK | ₹5,000 per sqft | ₹1,666,667 per sqft (price ÷ 3 bedrooms) |
| 5 | Medium | Available From allows past dates | Select an old date | Only today or future | Past dates accepted |
| 6 | Medium | Search only matches by title — city/type filters ignored | Search for "apartment", filter city "Mumbai" | Only Mumbai apartments | All apartments regardless of city |
| 7 | Medium | "Parking" and "Car Park" both in amenities (duplicate) | View Amenities checkbox list | One parking option | Two identical parking options |
| 8 | Medium | Only first photo is saved when multiple uploaded | Upload 3 photos, submit, inspect payload | All 3 photo names saved | Only first photo name in payload |
| 9 | Hard | Property age slider sends string "X years" not integer | Set age to 10, submit, inspect Network payload | `propertyAge: 10` | `propertyAge: "10 years"` |
| 10 | Hard | Featured Listing toggle has no visible effect | Toggle Featured on, list property | Listing shows "Featured" badge | No difference in display |
| 11 | Hard | API returns 200 with empty body {} | Submit valid listing, check Network | `{"listingId": "...", ...}` | `{}` |
| 12 | Hard | Rent price labeled "per month" but stored as annual | List a rental at ₹24,000 annual | ₹24,000/year stored and shown | ₹24,000/month displayed (misleading) |
| 13 | Hard | Search result count is off by one | List 3 properties, search all | "Found 3 properties" | "Found 4 properties" |

---

## Page 10 — Event Registration

| # | Tier | Bug | How to Reproduce | Expected | Actual |
|---|------|-----|-----------------|----------|--------|
| 1 | Easy | Event logo/banner is pixelated | View page header | Clear logo | Pixelated low-quality image |
| 2 | Easy | T-shirt size "XXL" missing from dropdown | Open T-shirt Size dropdown | XS, S, M, L, XL, XXL | XXL is missing |
| 3 | Easy | Event dates show year 2025 (past) | Select any event | 2026 or current year dates | All events show 2025 dates |
| 4 | Easy | "VIP" ticket labeled "VVIP" | View Ticket Type radio options | "VIP" | "VVIP" |
| 5 | Medium | Student ID upload not shown for Student ticket | Select "Student" ticket type | ID upload section appears | Section stays hidden |
| 6 | Medium | Coupon message says "10% off" but applies 50% | Enter EVENT50, click Apply Coupon | Message matches actual discount | Message: "10% off", Actual: 50% off |
| 7 | Medium | More than 10 tickets allowed | Enter 15 in ticket count, submit | Max 10 enforced | 15 accepted |
| 8 | Medium | Total doesn't recalculate when ticket type changes | Select General, note total; switch to VIP | Total updates | Total stays at old value |
| 9 | Medium | Success toast shows even on API error | Cause an API error, watch toast | Error toast on failure | "Registration Successful" toast always |
| 10 | Hard | Newsletter checkbox always sends true | Uncheck newsletter, submit, inspect payload | `newsletter: false` | `newsletter: true` |
| 11 | Hard | API ignores coupon — charges full price | Apply EVENT50 (50% off), submit, check API response | Discounted total in response | Full price returned by API |
| 12 | Hard | Terms & Conditions not required | Leave terms unchecked, submit | Validation error | Form submits |
| 13 | Hard | Card number always included in payload for UPI/Wallet | Select UPI payment, submit, inspect Network | `cardNumber` absent for UPI | `cardNumber` present in payload |
| 14 | Hard | Registration overwrites previous (no history) | Register twice, check list | Both registrations shown | Only latest registration shown |

---

## Bug Count Summary

| Page | Easy | Medium | Hard | Total |
|------|------|--------|------|-------|
| Hospital | 4 | 5 | 4 | 13 |
| Hotel | 4 | 5 | 4 | 13 |
| E-Commerce | 3 | 5 | 5 | 13 |
| HR | 4 | 4 | 5 | 13 |
| Flight | 4 | 5 | 5 | 14 |
| Restaurant | 4 | 5 | 4 | 13 |
| School | 4 | 6 | 4 | 14 |
| Banking | 4 | 5 | 3 | 12 |
| Real Estate | 3 | 5 | 5 | 13 |
| Event | 4 | 5 | 5 | 14 |
| **Global** | — | — | — | **6** |
| **Total** | **38** | **50** | **44** | **138** |
