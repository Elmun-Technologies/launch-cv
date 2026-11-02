/**
 * Applicant tracking system guides (/ats and /ats/[vendor]).
 *
 * Rule for this file: every vendor-specific statement lives in `facts` and
 * names the source(s) it comes from (indexes into `sources`). Each source is
 * the vendor's own public documentation or newsroom, with the date we checked
 * it. Anything we could not verify for a vendor is written as general ATS
 * guidance in `tips`, `checklist` and `faqs` ("Most applicant tracking
 * systems…"), never as a fact about that vendor. No market-share or
 * customer-count claims.
 *
 * Checked 2026-11-02. When a source changes, re-check it, update the wording
 * and `checked`, and bump ATS_UPDATED.
 */
import { fitTitle } from "@/lib/build-metadata";

export const ATS_UPDATED = "2026-11-02";
/** Shown as "Sources (checked Nov 2026)". */
export const ATS_CHECKED_LABEL = "Nov 2026";

export type AtsSource = {
  /** Page title as the vendor publishes it. */
  title: string;
  /** Who publishes it, e.g. "Workday Administrator Guide". */
  publisher: string;
  url: string;
  /** ISO date we last checked the page. */
  checked: string;
};

export type AtsFact = {
  /** Short label for the card. */
  label: string;
  /** The claim, worded as closely to the source as we can. */
  text: string;
  /** Indexes into `sources`. */
  src: number[];
};

export type AtsVendor = {
  slug: string;
  /** Display name, e.g. "Taleo". */
  name: string;
  /** Name with the owner as the vendor's own docs show it, e.g. "Oracle Taleo". */
  fullName: string;
  /** Grey second half of the H1. */
  tagline: string;
  /** One-line summary for cards and the index page. */
  summary: string;
  /** Meta description, 120–160 characters. */
  metaDescription: string;
  /** Hero lead paragraph. Only sourced statements, or clearly general ones. */
  intro: string;
  /** Decorative poster word in the hero panel. */
  poster: string;
  /** Resume example used in the illustrated hero (slug in lib/resume-examples.ts). */
  heroExample: string;
  facts: AtsFact[];
  /** Practical tips for applying through this system. General guidance unless it restates a sourced fact. */
  tips: { t: string; d: string }[];
  checklist: string[];
  faqs: { q: string; a: string }[];
  sources: AtsSource[];
};

const C = ATS_UPDATED;

export const ATS_VENDORS: AtsVendor[] = [
  {
    slug: "workday",
    name: "Workday",
    fullName: "Workday",
    tagline: "What the application form will read.",
    summary: "Optional or required Candidate Home accounts, resume parsing into the form, and the sections parsing leaves for you to fill in.",
    metaDescription:
      "How Workday applications use your resume: what parsing fills in, what it skips, reusing your last application, and a checklist before you upload.",
    intro:
      "When you attach a resume on a Workday career site, Workday parses it into the application form: your contact details, work history and education. Here's what it fills in, what it leaves for you, and how to make it go smoothly.",
    poster: "AUTOFILL",
    heroExample: "product-manager",
    facts: [
      {
        label: "An account may be optional",
        text: "Candidates can apply without signing in unless the employer turns on the setting that requires a Candidate Home account. Your email address is the account's identifier, and the account lets you track applications, see tasks, keep drafts and reuse information from an earlier application.",
        src: [0],
      },
      {
        label: "What the resume fills in",
        text: "When you attach a resume, Workday parses personal and contact information, work experience and education into the application, and you can change or add to that data while you apply.",
        src: [1],
      },
      {
        label: "What it leaves for you",
        text: "Workday's admin guide says parsing doesn't fill fields the employer has set as hidden, or the Languages and Skills sections. Fill those in yourself.",
        src: [2],
      },
      {
        label: "Format affects the result",
        text: "Workday says parsing results can vary with a resume's format and the order of its words, and recommends resumes without images or image-based styling.",
        src: [2],
      },
      {
        label: "Parsing can be switched off",
        text: "Employers can set up job application templates that hide resume parsing for external candidates. On those applications you type your history in yourself.",
        src: [2],
      },
      {
        label: "Applying again",
        text: "If you're signed in to Candidate Home and apply for another job, you can use your last application or upload a new resume. You can still attach a resume or cover letter when you reuse your last application.",
        src: [1],
      },
      {
        label: "File types are an employer setting",
        text: "Which file types can be uploaded is set in each employer's Workday tenant: all types Workday supports, or only a specific list. Check the upload screen rather than assuming.",
        src: [3],
      },
      {
        label: "Announced: Workday Candidate Profile",
        text: "On October 13, 2026, Workday announced Candidate Profile: one profile you sign in to with your email and a one-time code and reuse when you apply on Workday-hosted career sites. Workday expects general availability in early 2027, employers can opt out, and Workday says the profile doesn't decide who gets hired or sort and filter applicants.",
        src: [4, 5],
      },
    ],
    tips: [
      {
        t: "Use one email everywhere",
        d: "Your email identifies your Candidate Home account. Using the same address, plus a password manager, saves you from duplicate profiles and lockouts.",
      },
      {
        t: "Upload, then read every field",
        d: "Parsing saves typing, but titles, company names and dates can land in the wrong boxes. Compare the form with your resume before you click Next.",
      },
      {
        t: "Fill in skills by hand",
        d: "Since parsing skips the Skills section, type in the skills from the job post that you really have, in the post's wording.",
      },
      {
        t: "Re-upload a tailored resume",
        d: "If you reuse your last application, attach the version tailored to this job. Recruiters read the file, not only the form.",
      },
    ],
    checklist: [
      "One-column layout, no tables or text boxes",
      "No images or image-based styling",
      "Contact details in the body, under your name",
      "Standard headings: Experience, Education, Skills",
      "Skills and languages typed into the form",
      "Every auto-filled field reviewed before submitting",
    ],
    faqs: [
      {
        q: "Why do I have to re-enter my resume after uploading it?",
        a: "Workday fills parts of the form from your resume, but you still confirm each entry. Its admin guide says parsing doesn't fill Skills, Languages or fields the employer has hidden, and some employers turn parsing off for external applicants entirely.",
      },
      {
        q: "Do I need a Workday account to apply?",
        a: "It depends on the employer. Workday lets candidates apply without signing in unless the employer requires a Candidate Home account. An account helps if you'll apply again, because you can reuse your last application.",
      },
      {
        q: "PDF or Word for Workday?",
        a: "Allowed file types are set by each employer, so use what the upload screen accepts. Either way, export a text-based file from your editor rather than a scan or a photo, and skip images, which Workday recommends against.",
      },
      {
        q: "Does Workday reject resumes automatically?",
        a: "Employers decide how they screen, through the questions and requirements they set up. Workday says its new Candidate Profile doesn't decide who gets hired or sort and filter applicants. What you control is whether your resume is read correctly and clearly matches the job post.",
      },
    ],
    sources: [
      {
        title: "Steps: Set Up Candidate Home Accounts",
        publisher: "Workday Administrator Guide",
        url: "https://doc.workday.com/admin-guide/en-us/human-capital-management/recruiting/career-sites/gtv1538650489786.html",
        checked: C,
      },
      {
        title: "Prospects and Candidates",
        publisher: "Workday Education, Recruiting for Administrators course manual",
        url: "https://doc.workday.com/workday-education/en-us/course-manuals/recruiting-for-administrators/prospects-and-candidates.html",
        checked: C,
      },
      {
        title: "Concept: Resume Parsing",
        publisher: "Workday Administrator Guide",
        url: "https://doc.workday.com/admin-guide/en-us/human-capital-management/recruiting/candidates/set-up-prospects-and-candidates/hdc1552497830785.html",
        checked: C,
      },
      {
        title: "Reference: Edit Tenant Setup - System",
        publisher: "Workday Administrator Guide",
        url: "https://doc.workday.com/admin-guide/en-us/manage-workday/tenant-configuration/tenant-setup/dan1370797880489.html",
        checked: C,
      },
      {
        title: "Workday Candidate Profile: Customer & Employer FAQ",
        publisher: "Workday Community",
        url: "https://community-content.workday.com/en-us/public/products/talent-management/talent-acquisition/workday-candidate-profile-employer-faq.html",
        checked: C,
      },
      {
        title: "New Workday Candidate Profile Lets Job Seekers Save Their Information Once and Use It Every Time They Apply Through Workday",
        publisher: "Workday Newsroom, Oct 13, 2026",
        url: "https://newsroom.workday.com/2026-10-13-New-Workday-Candidate-Profile-Lets-Job-Seekers-Save-Their-Information-Once-and-Use-It-Every-Time-They-Apply-Through-Workday",
        checked: C,
      },
    ],
  },
  {
    slug: "greenhouse",
    name: "Greenhouse",
    fullName: "Greenhouse",
    tagline: "File types, size limits and Quick Apply.",
    summary: "Five accepted file types, a 2.5 MB parsing limit, and a MyGreenhouse profile that can autofill applications.",
    metaDescription:
      "Greenhouse accepts .doc, .docx, .pdf, .rtf and .txt resumes. See its 2.5 MB parsing limit, how MyGreenhouse Quick Apply works and what to check first.",
    intro:
      "Greenhouse accepts resumes as .doc, .docx, .pdf, .rtf or .txt files, and its MyGreenhouse profile can autofill applications where the employer has turned it on. Here's what that means for the file you upload.",
    poster: "PARSE",
    heroExample: "software-engineer",
    facts: [
      {
        label: "Accepted file types",
        text: "Candidates can upload resumes, cover letters and other documents as .doc, .docx, .pdf, .rtf or .txt files, up to 100 MB.",
        src: [0],
      },
      {
        label: "Parsing has a much smaller limit",
        text: "Greenhouse's resume parser can't handle files larger than 2.5 MB, which usually happens when a resume includes many high-quality images.",
        src: [1],
      },
      {
        label: "What else breaks parsing",
        text: "Greenhouse lists graphics, photos or word art, resumes uploaded as an image rather than a document, and complex layouts with tables, headers and footers among the causes of an unsuccessful parse. When parsing fails, the details are entered by hand.",
        src: [1],
      },
      {
        label: "MyGreenhouse Quick Apply",
        text: "When an employer has it turned on, an Autofill with Greenhouse button appears on its job posts. It fills the application from your MyGreenhouse profile, which can hold contact details, education, employment history and online profiles. The account is password-free.",
        src: [2],
      },
      {
        label: "One resume per profile",
        text: "MyGreenhouse recommends uploading a PDF for best results and says parsing can make mistakes, so review your details before saving. It keeps one resume, the one you uploaded most recently, and you can replace it at any time.",
        src: [3],
      },
      {
        label: "Edit before you submit",
        text: "You can change your profile or edit autofilled answers before submitting. MyGreenhouse can't change an application you've already sent; for corrections, contact the employer.",
        src: [3],
      },
    ],
    tips: [
      {
        t: "Keep the file small",
        d: "A text-based resume exported from your editor is usually far below 2.5 MB. If yours is bigger, it probably has images in it, and those don't help parsing anyway.",
      },
      {
        t: "Tailor the file, not just the profile",
        d: "Your MyGreenhouse profile holds one resume. When you tailor a resume for a job, upload that version, then check the profile still says what you want.",
      },
      {
        t: "Answer custom questions in full",
        d: "Most applicant tracking systems let employers add their own questions to the form. Treat them like part of the resume: specific, honest and in the job post's words.",
      },
      {
        t: "Put links in plain text",
        d: "Write out your portfolio or GitHub URL. Links hidden behind icons or images may not survive parsing.",
      },
    ],
    checklist: [
      "Saved as .pdf, .docx, .doc, .rtf or .txt",
      "File under 2.5 MB, with no embedded images",
      "No tables, headers, footers or word art",
      "Portfolio or work samples linked in plain text",
      "MyGreenhouse profile details reviewed",
      "Autofilled answers checked before submitting",
    ],
    faqs: [
      {
        q: "What file type should I use for Greenhouse?",
        a: "Greenhouse accepts .doc, .docx, .pdf, .rtf and .txt, and MyGreenhouse recommends a PDF for best results. Make sure the PDF is text you can highlight, not a scan.",
      },
      {
        q: "Why did my resume upload but the form stay empty?",
        a: "Greenhouse's parser can't handle files over 2.5 MB, and graphics, photos, tables, headers and footers can also make a parse fail. A smaller, plain one-column file usually fixes it. You can still type the fields in by hand.",
      },
      {
        q: "Why don't I see Quick Apply on a Greenhouse job?",
        a: "The Autofill with Greenhouse button appears only where the employer has turned it on. Without it, you apply with the regular form.",
      },
      {
        q: "Can I fix an application after I send it?",
        a: "Not through MyGreenhouse. Greenhouse says it can't change a submitted application, so contact the company you applied to.",
      },
    ],
    sources: [
      {
        title: "Supported formats for resumes, cover letters and other candidate uploads",
        publisher: "Greenhouse Support",
        url: "https://support.greenhouse.io/hc/en-us/articles/360052218132-Supported-formats-for-resumes-cover-letters-and-other-candidate-uploads",
        checked: C,
      },
      {
        title: "Unsuccessful resume parse",
        publisher: "Greenhouse Support",
        url: "https://support.greenhouse.io/hc/en-us/articles/200989175-Unsuccessful-resume-parse",
        checked: C,
      },
      {
        title: "MyGreenhouse Quick Apply",
        publisher: "Greenhouse Support",
        url: "https://support.greenhouse.io/hc/en-us/articles/35746094035099-MyGreenhouse-Quick-Apply",
        checked: C,
      },
      {
        title: "MyGreenhouse FAQ for Candidates",
        publisher: "Greenhouse Support",
        url: "https://support.greenhouse.io/hc/en-us/articles/43418495049499-MyGreenhouse-FAQ-for-Candidates",
        checked: C,
      },
    ],
  },
  {
    slug: "icims",
    name: "iCIMS",
    fullName: "iCIMS",
    tagline: "Upload your resume before anything else.",
    summary: "Start with your email, upload the resume first so parsing fills your profile, and keep a separate login for each employer.",
    metaDescription:
      "Applying on an iCIMS career portal? Why to upload your resume first, what social sign-in brings in, what trips the parser and a checklist before you apply.",
    intro:
      "On an iCIMS career portal you start with your email address, build a profile, and the portal uses your uploaded resume to fill in profile fields. iCIMS's own candidate guide says to upload the resume first. Here's the rest.",
    poster: "PROFILE",
    heroExample: "registered-nurse",
    facts: [
      {
        label: "It starts with your email",
        text: "You enter your email address and the portal works out whether you're new or already have a profile. New applicants enter their name and email and create a login and password, then build the profile from a resume upload or a social account.",
        src: [0],
      },
      {
        label: "Upload the resume first",
        text: "Uploading a resume can fill in profile fields, and iCIMS advises uploading it before filling in other fields so parsing captures as much as possible. You then review the parsed details before you submit.",
        src: [0],
      },
      {
        label: "Where the file can come from",
        text: "Depending on how the employer set up the portal, you can upload from your computer or from Google Drive, Dropbox or OneDrive.",
        src: [0],
      },
      {
        label: "Social sign-in brings less",
        text: "Building a profile from a social account may bring in only limited details, such as your first name, last name and email.",
        src: [0],
      },
      {
        label: "Keep it current from the dashboard",
        text: "The candidate dashboard is where you update your profile, see open jobs and check the status of applications you've sent.",
        src: [0],
      },
      {
        label: "One login per employer",
        text: "Each employer's portal has its own login, and logins aren't shared between employers.",
        src: [2],
      },
      {
        label: "What trips the parser",
        text: "iCIMS's documentation on importing resumes says it uses third-party parsing technology that sometimes misses content in non-standard layouts, most often text boxes, images, annotations and tables, and that a resume with the name only in the document header fails to parse.",
        src: [1],
      },
    ],
    tips: [
      {
        t: "Put your name in the body",
        d: "Type your name as the first line of the page, not in the Word header. Do the same with your phone number and email.",
      },
      {
        t: "Prefer the resume over social sign-in",
        d: "A resume upload can fill in your work history and education; a social profile may only bring your name and email.",
      },
      {
        t: "Track which email you used where",
        d: "Since every employer's portal has its own login, note the email and password you used for each one. A password manager makes this painless.",
      },
      {
        t: "Update the profile, not just the file",
        d: "Recruiters often search profile fields, not only attachments. When your resume changes, update your profile from the dashboard too.",
      },
    ],
    checklist: [
      "Name and contact details in the body, not the header",
      "No text boxes, tables, images or comments",
      "Resume uploaded before filling in other fields",
      "Parsed work history and education checked",
      "Login saved for this employer's portal",
      "Text-based PDF or DOCX, not a scan",
    ],
    faqs: [
      {
        q: "Why is my iCIMS profile missing jobs from my resume?",
        a: "iCIMS says its parser most often misses content in text boxes, images, annotations and tables. A one-column resume with plain-text job entries usually parses better. Fill in anything missing by hand before you submit.",
      },
      {
        q: "Why can't I log in to another company's iCIMS portal?",
        a: "Each employer's portal has its own login, and iCIMS says logins aren't shared between employers. Create a new one, or use the password reset link on that portal if you've applied there before.",
      },
      {
        q: "Should I sign in with a social account?",
        a: "It's faster, but iCIMS notes it may only bring in limited details such as your name and email. Uploading your resume fills in more of your profile.",
      },
    ],
    sources: [
      {
        title: "Candidate Guide to iCIMS Career Portals",
        publisher: "iCIMS Community",
        url: "https://community.icims.com/articles/HowTo/Candidate-Guide-to-the-iCIMS-Talent-Platform",
        checked: C,
      },
      {
        title: "Creating New Candidates via Bulk File Transfer (Migrating Legacy Resumes during Implementation)",
        publisher: "iCIMS Community",
        url: "https://community.icims.com/articles/Knowledge/Creating-New-Candidates-via-Bulk-File-Transfer-Migrating-Legacy-Resumes-during-Implementation",
        checked: C,
      },
      {
        title: "Changing or Resetting Your Password: Candidates & New Hires",
        publisher: "iCIMS Community",
        url: "https://community.icims.com/s/article/Changing-Your-Password-Candidates-New-Hires",
        checked: C,
      },
    ],
  },
  {
    slug: "taleo",
    name: "Taleo",
    fullName: "Oracle Taleo",
    tagline: "Upload, paste or import, then review.",
    summary: "Two editions, a Resume Upload step that can pre-fill the application, and image resumes that aren't parsed.",
    metaDescription:
      "How Oracle Taleo career sites use your resume: upload, paste or import from Indeed, what gets pre-filled, why image resumes aren't parsed, and what to check.",
    intro:
      "Oracle documents two Taleo products, Taleo Enterprise and Taleo Business Edition, and each employer sets up its own application flow. Where the resume step is turned on, Taleo extracts your details and pre-fills part of the application. Here's how to work with it.",
    poster: "UPLOAD",
    heroExample: "accountant",
    facts: [
      {
        label: "Two editions",
        text: "Oracle publishes separate documentation for Taleo Enterprise Edition and Taleo Business Edition, and employers configure their own application flows, so the screens differ from one employer to the next.",
        src: [0, 2],
      },
      {
        label: "Resume upload pre-fills the form",
        text: "In Taleo Enterprise, the system extracts relevant information from your resume or imported profile and fills out part of the submission. You can review what was extracted and make changes in the next steps. This depends on the employer including the Resume Upload block in its application flow.",
        src: [1],
      },
      {
        label: "Pasting works on phones",
        text: "On a mobile device, a career section can offer a Paste the resume option. The pasted text is parsed to fill in the application and saved as a text file attached to your submission.",
        src: [0],
      },
      {
        label: "Import from Indeed, where offered",
        text: "Where the employer has set it up, you can import your Indeed profile on the resume step. It fills standard fields such as name, location, summary, work experience, education and certifications, but Indeed attachments aren't imported.",
        src: [3],
      },
      {
        label: "Image resumes aren't parsed",
        text: "Since release 24A, Taleo Business Edition can be set to accept PNG and JPEG resumes, but Oracle says a resume in an image format isn't parsed, so it doesn't fill the resume keyword field recruiters search.",
        src: [2],
      },
    ],
    tips: [
      {
        t: "Keep a plain-text copy ready",
        d: "If the form offers to paste your resume, paste clean text: no tables or columns, one entry per line. Bullets and spacing may not survive the paste.",
      },
      {
        t: "Never upload a photo of your resume",
        d: "Export a PDF or DOCX from your editor. An image may attach, but its text can't be searched.",
      },
      {
        t: "Add files Indeed can't bring",
        d: "If you import from Indeed, upload your tailored resume and cover letter as well, since attachments don't come across.",
      },
      {
        t: "Expect a multi-page form",
        d: "Many applicant tracking systems spread the application over several pages. Keep your dates, addresses and past employers handy so you answer consistently.",
      },
    ],
    checklist: [
      "Text-based PDF or DOCX, never an image",
      "A plain-text copy ready to paste",
      "Standard headings and one date format",
      "Pre-filled work history and education reviewed",
      "Dates and employers consistent with your resume",
      "Tailored resume attached, even after an Indeed import",
    ],
    faqs: [
      {
        q: "Can Taleo read a scanned resume?",
        a: "Oracle's Taleo Business Edition documentation says image resumes aren't parsed, so their text isn't searchable. Upload a file exported from your word processor instead.",
      },
      {
        q: "Should I paste my resume or upload it?",
        a: "Use whatever the form offers. Both can pre-fill the application when the employer has turned them on. If you paste, paste clean text and check the result.",
      },
      {
        q: "Why does each Taleo site look different?",
        a: "Oracle has two Taleo editions, and each employer configures its own application flow, so the steps and fields vary.",
      },
    ],
    sources: [
      {
        title: "Plain Text Resume Parsing for Mobile Devices",
        publisher: "Oracle Taleo Enterprise Edition, Implementing Career Section 23B",
        url: "https://docs.oracle.com/en/cloud/saas/taleo-enterprise/23b/otcug/c-plaintextresumeparsingmobile.html",
        checked: C,
      },
      {
        title: "Candidate File Import",
        publisher: "Oracle Taleo Enterprise Edition, Career Section User Guide",
        url: "https://docs.oracle.com/cloud/latest/taleo/OTCUG/_candidatefileimport.htm",
        checked: C,
      },
      {
        title: "Oracle Fusion Cloud Taleo Business (TBE) 24A What's New",
        publisher: "Oracle",
        url: "https://docs.oracle.com/en/cloud/saas/readiness/hcm/24a/tale-24a/24A-tbe-wn-f32282.htm",
        checked: C,
      },
      {
        title: "Profile Information Imported from Indeed",
        publisher: "Oracle Taleo Enterprise Edition, Implementing Career Section 24D",
        url: "https://docs.oracle.com/en/cloud/saas/taleo-enterprise/24d/otcug/c-profileinfoimportedindeed.html",
        checked: C,
      },
    ],
  },
  {
    slug: "lever",
    name: "Lever",
    fullName: "Lever",
    tagline: "A short form, so the resume does the work.",
    summary: "A short default form, a location filled in from your resume, and parsed resume text that recruiters can search.",
    metaDescription:
      "Applying through Lever? What its default application form asks for, how your resume fills the location field and gets searched, and a checklist to use.",
    intro:
      "Lever's standard application form asks for your resume, name, email, phone, location and current company, and recruiters can search the text Lever parses from your resume. With so few fields, the file you upload does most of the work.",
    poster: "FIELDS",
    heroExample: "ux-designer",
    facts: [
      {
        label: "The default form",
        text: "Lever's standard application form asks for resume, full name, email, phone, current location and current company. Full name and email are required by default, and employers can make the other fields mandatory.",
        src: [0],
      },
      {
        label: "Your resume fills in the location",
        text: "The current location field is filled in from your resume. If you don't upload one, or the location can't be parsed, you pick a location from a list instead.",
        src: [0],
      },
      {
        label: "Recruiters search parsed text",
        text: "Lever's search covers parseable content attached to candidate profiles, including resumes, and a Resume filter limits a search to text parsed from the resume.",
        src: [1],
      },
      {
        label: "Applying from LinkedIn",
        text: "Where the employer uses Lever's LinkedIn Apply Connect integration, you must include a resume if the employer's form requires one and answer any required custom questions before you can submit.",
        src: [2],
      },
    ],
    tips: [
      {
        t: "Run the highlight test",
        d: "Open your PDF and try to select a line of text. If you can't, the file is probably an image; re-export it from your editor before you apply.",
      },
      {
        t: "Make the short form count",
        d: "With only a few fields, the resume does most of the work. Keep your current title, company and city at the top so they match what you type in the form.",
      },
      {
        t: "Use the extra-info box",
        d: "Many application forms include an optional free-text field. Two or three sentences tying your experience to the role act as a short cover letter.",
      },
      {
        t: "Use the job post's words",
        d: "Recruiters can search the text of your resume, so name the skills and tools from the post that you really have, spelled the way the post spells them.",
      },
    ],
    checklist: [
      "A .docx or text-based PDF",
      "Text you can highlight, not an image",
      "Name and email clearly at the top",
      "City and current company match the form",
      "Portfolio links written out in full",
      "Optional questions answered in a sentence or two",
    ],
    faqs: [
      {
        q: "What does Lever's application form ask for?",
        a: "By default: resume, full name, email, phone, current location and current company. Employers can add their own questions and make more fields required.",
      },
      {
        q: "How do I know if my resume can be read?",
        a: "Try to highlight the text with your cursor. If you can't select it, the file is probably an image, and most applicant tracking systems can't read text from images. Re-export it from your editor as a text-based PDF or .docx.",
      },
      {
        q: "Why does my resume's wording matter so much on Lever?",
        a: "Lever lets recruiters search the text parsed from resumes. If your resume names a skill the way the job post does, a search for that term can find it.",
      },
    ],
    sources: [
      {
        title: "Configuring your Lever application form",
        publisher: "Lever Help Center",
        url: "https://help.lever.co/hc/en-us/articles/20087243347741-Configuring-your-Lever-application-form",
        checked: C,
      },
      {
        title: "Searching the database for candidates",
        publisher: "Lever Help Center",
        url: "https://help.lever.co/hc/en-us/articles/20087317030685-Searching-the-database-for-candidates",
        checked: C,
      },
      {
        title: "Enabling and using the LinkedIn Apply Connect Integration",
        publisher: "Lever Help Center",
        url: "https://help.lever.co/hc/en-us/articles/20087283915293-Enabling-and-using-the-LinkedIn-Apply-Connect-Integration",
        checked: C,
      },
    ],
  },
  {
    slug: "successfactors",
    name: "SuccessFactors",
    fullName: "SAP SuccessFactors",
    tagline: "Files that parse, and data that stays.",
    summary: "Listed upload formats, scanned PDFs that don't parse well, protected PDFs that can't be attached, and old profile data that may stay.",
    metaDescription:
      "SAP SuccessFactors resume tips: which files you can upload, why scanned or protected PDFs fail, why old profile data may stay, and what to check first.",
    intro:
      "SAP SuccessFactors Recruiting can parse your resume into your candidate profile, and SAP documents which files work and which don't. The catch for repeat applicants: parsing may not replace details already in your profile.",
    poster: "PARSE",
    heroExample: "financial-analyst",
    facts: [
      {
        label: "Accepted uploads",
        text: "For resumes and cover letters, SAP lists .doc, .docx, .gif, .jpeg, .jpg, .pdf and .txt as accepted, and .html, .png, .ppt, .pptx and .xls among the files that aren't supported. SAP's resume parsing page gives a different list, so follow what the upload screen allows.",
        src: [0, 1],
      },
      {
        label: "Protected PDFs can't be attached",
        text: "You can't attach a protected or secured PDF as a resume.",
        src: [0],
      },
      {
        label: "Scanned PDFs don't parse well",
        text: "PDFs that were scanned in or were previously images won't parse as expected; a PDF made from a text document parses as designed.",
        src: [2],
      },
      {
        label: "Plain-text files",
        text: "If you upload a .txt file, save it with Unicode encoding rather than ANSI.",
        src: [0],
      },
      {
        label: "Existing data may stay",
        text: "SAP says resume parsing isn't always accurate. Where the employer uses Mobile Apply, parsing only fills background fields that are empty, so details already in your profile aren't overwritten.",
        src: [2],
      },
      {
        label: "Language support",
        text: "Resume parsing is supported only in a set list of languages, including English and Spanish.",
        src: [2],
      },
    ],
    tips: [
      {
        t: "Update your profile by hand",
        d: "If you've applied to this employer before, open your candidate profile and update work history and education yourself. A new upload may not replace what's there.",
      },
      {
        t: "Remove PDF passwords",
        d: "Export a fresh, unprotected PDF from your editor. Secured PDFs can't be attached.",
      },
      {
        t: "Send text, not a picture",
        d: "Scanned PDFs don't parse as expected. A resume exported straight from your editor keeps its text exact.",
      },
      {
        t: "Read the whole profile before you submit",
        d: "Most applicant tracking systems show you a summary page. Check dates, titles and education there, since that's what recruiters see first.",
      },
    ],
    checklist: [
      "Text-based PDF or DOCX, not a scan",
      "No password or security on the PDF",
      "Profile history updated by hand if you've applied before",
      "Standard headings and one date format",
      "Parsed fields checked against your resume",
      "Summary page read before submitting",
    ],
    faqs: [
      {
        q: "Why didn't my new resume update my SuccessFactors profile?",
        a: "SAP documents that with Mobile Apply, parsing only fills background fields that are empty and doesn't overwrite existing data. Update those sections of your profile by hand.",
      },
      {
        q: "Can I upload a password-protected PDF?",
        a: "No. SAP says protected or secured PDFs can't be attached. Export an unprotected copy.",
      },
      {
        q: "Which file type is safest?",
        a: "A PDF made from a text document, or a .docx. Both are on SAP's list of accepted uploads, and SAP says scanned PDFs won't parse as expected.",
      },
    ],
    sources: [
      {
        title: "Candidate Profile in SAP SuccessFactors",
        publisher: "SAP Help Portal, Setting Up and Maintaining SAP SuccessFactors Recruiting",
        url: "https://help.sap.com/docs/successfactors-recruiting/setting-up-and-maintaining-sap-successfactors-recruiting/candidate-profile-in-sap-successfactors",
        checked: C,
      },
      {
        title: "Working with Resume Parsing",
        publisher: "SAP Help Portal",
        url: "https://help.sap.com/docs/SAP_SUCCESSFACTORS_RECRUITING/8477193265ea4172a1dda118505ca631/07b6d03076a149b78f4f7a615e3025fd.html",
        checked: C,
      },
      {
        title: "2081576 - Using the SuccessFactors Recruiting Resume Parsing Feature",
        publisher: "SAP Knowledge Base Article (SAP login may be required)",
        url: "https://userapps.support.sap.com/sap/support/knowledge/en/2081576",
        checked: C,
      },
    ],
  },
];

export function getAtsVendor(slug: string): AtsVendor | undefined {
  return ATS_VENDORS.find((v) => v.slug === slug);
}

export function atsPageTitle(v: AtsVendor): string {
  return fitTitle(`${v.fullName} Resume Tips: How to Apply (2026)`, `${v.name} Resume Tips: How to Apply (2026)`, `${v.name} Resume Tips`);
}

/**
 * Guidance that applies to applicant tracking systems in general (used on the
 * /ats index and every vendor page). Not a claim about any single vendor.
 */
export const GENERAL_ATS_TIPS: { t: string; d: string }[] = [
  {
    t: "Tables and text boxes",
    d: "Many parsers skip or merge text inside them, so job details can end up in the wrong field or go missing.",
  },
  {
    t: "Headers and footers",
    d: "Contact details placed there may not reach the application form. Put them in the body, under your name.",
  },
  {
    t: "Creative section names",
    d: "“My Journey” instead of “Experience” makes job history harder to split into entries.",
  },
  {
    t: "Mixed date formats",
    d: "Start and end dates can land in the wrong fields. Pick one format, month and year, and use it everywhere.",
  },
];

/** FAQ for the /ats index. General guidance only. */
export const ATS_INDEX_FAQS: { q: string; a: string }[] = [
  {
    q: "What is an applicant tracking system?",
    a: "Software employers use to post jobs, collect applications and move candidates through hiring. When you apply on a company's career site, you're usually filling in that company's applicant tracking system.",
  },
  {
    q: "Does an ATS reject resumes automatically?",
    a: "Employers decide how they screen, for example with required questions or knockout criteria they set up. What you control is whether your resume is read correctly and clearly matches the job post.",
  },
  {
    q: "How can I tell which system an employer uses?",
    a: "Look at the application page's web address and branding once you click Apply. The address often includes the system's name, and the sign-in or upload screen usually shows it too.",
  },
  {
    q: "Is one resume format safe for every system?",
    a: "A one-column, text-based PDF or .docx with standard headings works well almost everywhere. The vendor guides below list the file types each system documents, since employers can change what's allowed.",
  },
];
