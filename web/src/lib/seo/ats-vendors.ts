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
  {
    slug: "ashby",
    name: "Ashby",
    fullName: "Ashby",
    tagline: "A resume field recruiters can turn off.",
    summary: "A single resume-upload field that employers can make optional, a 50 MB cap that drops to 16 MB for search and autofill, and an opt-in AI review of what's on the page.",
    metaDescription: "How Ashby handles your resume: upload and parsing size limits, accepted file types, the optional resume field, and how AI-Assisted Application Review reads it.",
    intro:
      "Ashby's application form can include a Resume Upload question that, where the employer keeps it, maps straight to your candidate profile. Ashby's own documentation sets limits on that upload and lets employers make it optional or run resumes through an AI reviewer. Here's what that means for your file.",
    poster: "CRITERIA",
    heroExample: "data-scientist",
    facts: [
      {
        label: "One resume field, used once",
        text: "Ashby's application-forms documentation describes the Resume Upload question as a single-file upload that sets the candidate's resume field, and says this question type can only be added once to a form.",
        src: [0],
      },
      {
        label: "Resumes can be optional",
        text: "Ashby's product updates say admins can make the Resume field on an application form optional, or remove it entirely, but Ashby notes this is only supported on newly created forms.",
        src: [1],
      },
      {
        label: "Two different size limits",
        text: "Ashby's application-forms documentation lists 50 MB as the maximum file size for a resume upload, but says a resume needs to be 16 MB or smaller for Ashby to process it for full-text search and for autofilling application fields.",
        src: [0],
      },
      {
        label: "File types accepted",
        text: "Ashby's docs say file-upload questions take standard document, image and video formats, such as PDF, DOC, DOCX, JPG, JPEG, PNG and common video formats; a later product update added plain-text (.txt) and Markdown (.md), so those no longer need converting to PDF first.",
        src: [0, 2],
      },
      {
        label: "Application resume vs. profile resume",
        text: "Ashby's release notes on resume display say the resume on an application and the resume on your overall candidate profile are tracked separately: updating the application's resume updates both, but deleting it leaves the candidate profile's resume in place and in use for that application.",
        src: [3],
      },
      {
        label: "AI-Assisted Application Review",
        text: "Where an employer turns it on, Ashby's AI-Assisted Application Review checks an applicant's resume against criteria the employer defines and returns a per-criterion result, with citations recruiters can check. Ashby says the tool doesn't make the hiring decision.",
        src: [4, 5],
      },
    ],
    tips: [
      {
        t: "Keep the file under 16 MB",
        d: "Ashby's upload cap is higher, but a file over 16 MB may miss out on full-text search and autofill. A text-based resume is almost always far smaller than that anyway.",
      },
      {
        t: "Don't rely on the resume field alone",
        d: "Some employers make Ashby's resume field optional. If the form also asks for a LinkedIn URL or portfolio link, fill those in too, so there's more than one way to confirm your background.",
      },
      {
        t: "Write to specific criteria",
        d: "Where AI-Assisted Application Review is on, it checks a resume against criteria the employer wrote, not a general impression. Name the skills and results from the job post directly, in similar words.",
      },
      {
        t: "Stick to plain formats",
        d: "PDF, DOC or DOCX parse the most predictably. If you only have a .txt or .md file, Ashby's file-upload fields can now take those directly.",
      },
    ],
    checklist: [
      "PDF, DOC or DOCX, not a photo or scan",
      "File under 16 MB, well under the 50 MB cap",
      "Resume uploaded even where the field is marked optional",
      "LinkedIn URL or portfolio added if the form asks for one",
      "Skills and results worded to match the post's own language",
      "Right resume showing on the application after upload",
    ],
    faqs: [
      {
        q: "Do I have to upload a resume on Ashby?",
        a: "It depends on the employer. Ashby lets companies make the resume field optional or remove it on newly created application forms, so some job posts may not require one. Where a resume field is shown, Ashby's docs describe it as a single-file upload.",
      },
      {
        q: "What's the biggest file I can upload to an Ashby application?",
        a: "Ashby's documentation lists 50 MB as the hard cap, but says files need to be 16 MB or smaller for Ashby to run full-text search on them and use them to autofill the application. Keep it well under 16 MB if you can.",
      },
      {
        q: "Does Ashby use AI to screen resumes?",
        a: "Only where the employer turns it on. Ashby's AI-Assisted Application Review checks resumes against criteria the employer sets and gives recruiters a per-criterion result with citations; Ashby says people still make the decision.",
      },
      {
        q: "Why does my application show an old resume?",
        a: "Ashby keeps the resume on your overall candidate profile separate from the one on a specific application. Ashby's release notes say deleting an application's resume leaves the candidate profile's resume in place and in use for that application, so check which one is attached before you submit.",
      },
    ],
    sources: [
      {
        title: "Application Forms",
        publisher: "Ashby Help Center",
        url: "https://docs.ashbyhq.com/application-forms",
        checked: C,
      },
      {
        title: "Make Resume Optional for Applicants",
        publisher: "Ashby Product Updates",
        url: "https://www.ashbyhq.com/product-updates/make-resume-optional-for-applicants",
        checked: C,
      },
      {
        title: "Accept .txt and .md Files in Application Form File Fields",
        publisher: "Ashby Product Updates",
        url: "https://www.ashbyhq.com/product-updates/txt-md-application-file-field",
        checked: C,
      },
      {
        title: "Resume Display on Applications and Candidate Profiles",
        publisher: "Ashby Product Updates",
        url: "https://www.ashbyhq.com/product-updates/resume-display",
        checked: C,
      },
      {
        title: "AI-Assisted Application Review",
        publisher: "Ashby Help Center",
        url: "https://docs.ashbyhq.com/ai-assisted-application-review",
        checked: C,
      },
      {
        title: "AI-Assisted Application Review",
        publisher: "Ashby Blog, Product",
        url: "https://www.ashbyhq.com/blog/product/ai-assisted-application-review",
        checked: C,
      },
    ],
  },
  {
    slug: "smartrecruiters",
    name: "SmartRecruiters",
    fullName: "SmartRecruiters",
    tagline: "A portal that signs you in with a code, not a password.",
    summary: "A one-time passcode portal that replaced the old Smartr candidate account, what that portal shows you, and why a recruiter-entered application won't appear in it.",
    metaDescription: "How SmartRecruiters' candidate portal works: the one-time passcode sign-in that replaced Smartr, what you can see there, and what to check before you apply.",
    intro:
      "SmartRecruiters moved candidates off its old Smartr account system and onto an Applicant Tracking Portal that signs you in with a one-time passcode instead of a password. Here's what changed, what the portal shows, and what to watch for.",
    poster: "PASSCODE",
    heroExample: "sales-representative",
    facts: [
      {
        label: "Smartr is gone",
        text: "SmartRecruiters' Smartr transition announcement says it replaced the Smartr candidate portal with a new Applicant Tracking Portal (ATP) in its April 2024 quarterly release, and that access to existing Smartr accounts ended that July.",
        src: [0],
      },
      {
        label: "No account, just a code",
        text: "On the Applicant Tracking Portal, SmartRecruiters says candidates sign in with a one-time passcode sent to the email address they applied with, and that creating an account is no longer part of applying.",
        src: [0],
      },
      {
        label: "Not every application shows up",
        text: "SmartRecruiters' Smartr FAQ says an application a recruiter entered by hand, or one an agency submitted on a candidate's behalf, won't appear on the Applicant Tracking Portal.",
        src: [1],
      },
      {
        label: "What the portal lets you do",
        text: "SmartRecruiters' job-seeker resource page says a SmartRecruiters account lets you apply to roles, see whether your profile has been viewed, message the hiring team directly, and build a SmartProfile.",
        src: [2],
      },
      {
        label: "Withdrawing an application",
        text: "To withdraw an application or remove a profile from a specific company, SmartRecruiters' help pages say to sign in with the same email used to apply, open the job, and use the withdraw option.",
        src: [0],
      },
      {
        label: "What happens if you delete your profile",
        text: "SmartRecruiters' candidate privacy policy says a deletion request is passed on to every company you applied to, and that a company may keep some application data where its own legal obligations require it.",
        src: [3],
      },
    ],
    tips: [
      {
        t: "Use the email you applied with",
        d: "The one-time passcode goes to the address on your application, not whichever inbox you check most. Keep a note of which email you used for each employer.",
      },
      {
        t: "Don't expect a recruiter-entered application to show up",
        d: "If a recruiter or agency added you to a job rather than you applying directly, SmartRecruiters says it won't appear in your portal. Contact them directly if you need to check its status.",
      },
      {
        t: "Keep one SmartProfile current",
        d: "Since your profile can be seen across more than one application, keep its summary and most recent role up to date, not just the resume file you upload for a specific job.",
      },
      {
        t: "Answer custom questions as closely as the resume",
        d: "Most applicant tracking systems add their own screening questions. Answer them specifically, using the job post's own words.",
      },
    ],
    checklist: [
      "Applied with an email address you check regularly",
      "Noted which email goes with which employer's application",
      "Resume saved as a clean, text-based file",
      "SmartProfile summary and most recent role kept current",
      "Custom screening questions answered in full",
      "Used the portal to withdraw or update, rather than reapplying blind",
    ],
    faqs: [
      {
        q: "Why can't I log in to SmartRecruiters with my old password?",
        a: "SmartRecruiters retired its password-based Smartr candidate account. Its own transition announcement says sign-in now works through a one-time passcode sent to the email you applied with, and access to the old Smartr portal ended in mid-2024.",
      },
      {
        q: "Why don't I see an application I know I submitted?",
        a: "SmartRecruiters says the Applicant Tracking Portal doesn't show applications a recruiter entered manually or that an agency submitted on your behalf. Contact whoever submitted it to check its status.",
      },
      {
        q: "What does a SmartRecruiters account do for me?",
        a: "Per SmartRecruiters' job-seeker resource page, it lets you apply to postings, see whether your profile was viewed, message the hiring team, and keep a SmartProfile that employers can see across applications.",
      },
      {
        q: "Can I get my data removed from SmartRecruiters?",
        a: "You can ask to delete your profile. SmartRecruiters' candidate privacy policy says the request is passed to every company you applied to, and that a company may keep some data where it has its own legal reason to.",
      },
    ],
    sources: [
      {
        title: "Smartr Transition Announcement",
        publisher: "SmartRecruiters Customer Community",
        url: "https://customers.smartrecruiters.com/kb/articles/5362-smartr-transition-announcement",
        checked: C,
      },
      {
        title: "Smartr Frequently Asked Questions (FAQ)",
        publisher: "SmartRecruiters Customer Community",
        url: "https://customers.smartrecruiters.com/kb/categories/198-smartr-frequently-asked-questions-faq",
        checked: C,
      },
      {
        title: "SmartRecruiters for Job Seekers",
        publisher: "SmartRecruiters",
        url: "https://prod-syd.smartrecruiters.com/resources/job-seekers",
        checked: C,
      },
      {
        title: "Candidate Privacy Policy",
        publisher: "SmartRecruiters",
        url: "https://www.smartrecruiters.com/legal/candidate-privacy-policy/",
        checked: C,
      },
    ],
  },
  {
    slug: "jobvite",
    name: "Jobvite",
    fullName: "Jobvite",
    tagline: "A short form, unless LinkedIn covers it.",
    summary: "A Standard Career Site with only a few required fields, a resume-first tip for the fields it parses, and a LinkedIn Apply option that can waive the resume.",
    metaDescription: "How Jobvite applications work: the Standard Career Site's required fields, why to upload your resume first, and when a LinkedIn profile can replace it.",
    intro:
      "Jobvite's Standard Career Site keeps its required fields short, and Jobvite's own help center tells candidates to upload a resume before filling in anything else so parsing can fill in the rest. Here's what that means, and when you can skip the upload.",
    poster: "ORDER",
    heroExample: "marketing-manager",
    facts: [
      {
        label: "Only three required fields by default",
        text: "Jobvite's help center says the Standard Career Site's default required fields are first name, last name and email; employers add their own custom fields and questions on top of that.",
        src: [0],
      },
      {
        label: "Upload the resume first",
        text: "Jobvite's help center recommends uploading a resume first on a candidate record, so the system can parse details into the right fields before you fill in anything else by hand.",
        src: [1],
      },
      {
        label: "LinkedIn can stand in for a resume",
        text: "Where an employer turns on Apply with LinkedIn, Jobvite's help center says candidates who attach a LinkedIn profile aren't required to also upload a resume.",
        src: [0],
      },
      {
        label: "Resume, cover letter and LinkedIn sit together",
        text: "Jobvite's help center describes a Resume tab on each candidate record that holds the resume, cover letter and LinkedIn profile in one place.",
        src: [1, 2],
      },
      {
        label: "Resume-database search is a separate add-on",
        text: "Jobvite's help center describes resume-database integrations, such as its Broadbean Search option, as a feature that needs its own partner subscription, separate from the parsing on a standard career-site application.",
        src: [3],
      },
    ],
    tips: [
      {
        t: "Upload before you type",
        d: "Jobvite's own help center tells candidates to upload their resume first. Do that before touching any other field, so parsing has a clean pass at your details.",
      },
      {
        t: "Don't assume LinkedIn covers everything",
        d: "Attaching LinkedIn can waive the resume requirement, but a LinkedIn profile is rarely as detailed as a tailored resume. Upload one anyway where the option exists.",
      },
      {
        t: "Keep contact details obvious",
        d: "With only a few required fields, Jobvite leans on what parsing pulls from your resume. Put your name, email and phone in plain text at the top, not in a header or graphic.",
      },
      {
        t: "Check the Resume tab's contents",
        d: "If you can see your own record, confirm the resume, cover letter and LinkedIn link are the versions you meant to send, since Jobvite keeps all three together.",
      },
    ],
    checklist: [
      "Resume uploaded before any other field",
      "Name, email and phone in the body, not a header",
      "Standard section headings: Experience, Education, Skills",
      "LinkedIn profile added, with a resume uploaded too",
      "Cover letter attached where the form allows it",
      "Every custom question the employer added, answered in full",
    ],
    faqs: [
      {
        q: "Do I have to upload a resume for Jobvite?",
        a: "It depends on the employer's setup. Jobvite's help center says attaching a LinkedIn profile through Apply with LinkedIn can remove the resume requirement; outside of that, the Standard Career Site's own required fields are just first name, last name and email, so individual employers decide whether to require a resume on top.",
      },
      {
        q: "Why does Jobvite ask me to upload my resume before anything else?",
        a: "Jobvite's help center recommends uploading first so parsing can fill your details into the right fields. Filling in fields first and uploading after can leave the parsed and typed data out of sync.",
      },
      {
        q: "What's in my Jobvite Resume tab?",
        a: "Jobvite's help center describes a Resume tab on each candidate record that holds your resume, cover letter and LinkedIn profile together, so recruiters see all three in one place.",
      },
    ],
    sources: [
      {
        title: "Standard Career Site",
        publisher: "Jobvite Help Center",
        url: "https://help.jobvite.com/hc/en-us/articles/13518145486365",
        checked: C,
      },
      {
        title: "Candidates Tab",
        publisher: "Jobvite Help Center",
        url: "https://help.jobvite.com/hc/en-us/articles/18293340437405",
        checked: C,
      },
      {
        title: "Candidate Profile Overview",
        publisher: "Jobvite Help Center",
        url: "https://help.jobvite.com/hc/en-us/articles/29566902803741-Candidate-Profile-Overview",
        checked: C,
      },
      {
        title: "Resume Database Integrations",
        publisher: "Jobvite Help Center",
        url: "https://help.jobvite.com/hc/en-us/articles/18596124778397",
        checked: C,
      },
    ],
  },
  {
    slug: "bamboohr",
    name: "BambooHR",
    fullName: "BambooHR",
    tagline: "No built-in parsing, so the form is what gets read.",
    summary: "No native resume parsing, a per-opening cap on repeat applications, and help pages that don't quite agree on where that cap kicks in.",
    metaDescription: "BambooHR applicant tracking: why there's no native resume parsing, how candidates apply, the repeat-application cap, and what to check before you submit.",
    intro:
      "BambooHR's own hiring help pages say it doesn't parse resumes natively, so what you type into the application form carries more weight than it would on a system that reads the file for you. Here's what BambooHR's documentation says about applying, repeat applications and resumes.",
    poster: "MANUAL",
    heroExample: "administrative-assistant",
    facts: [
      {
        label: "No built-in resume parsing",
        text: "BambooHR's Hiring FAQ says BambooHR doesn't offer resume parsing itself, and points candidates and employers to partner integrations listed in the BambooHR Marketplace for that feature.",
        src: [0],
      },
      {
        label: "You apply through the company's own career page",
        text: "BambooHR's help center describes candidates applying either on the company's hosted careers page or on the company's own website, through an embedded version of that same form.",
        src: [1],
      },
      {
        label: "A cap on repeat applications",
        text: "BambooHR's Hiring FAQ says a job opening stops accepting applications once there are more than five applicants with the same phone number, or more than five with the same name plus either the same phone number or email.",
        src: [0],
      },
      {
        label: "A different number elsewhere",
        text: "A separate BambooHR help article gives a different rule: a job opening stops accepting applications from someone who applies with the same name and phone number five times within a six-month period. The two pages don't agree on the exact threshold or window, so treat either as approximate.",
        src: [0, 1],
      },
      {
        label: "Manually added candidates are labeled differently",
        text: "BambooHR's help center says a candidate a recruiter adds by hand, rather than one who applied directly, shows as \"Added\" instead of \"Applied,\" and notifies the job's creator and hiring lead.",
        src: [1],
      },
      {
        label: "Recruiters can update your profile after that",
        text: "BambooHR's help center says a candidate's profile page is where recruiters update applicant details such as name, email, phone and address, and can replace an uploaded resume.",
        src: [2],
      },
    ],
    tips: [
      {
        t: "Fill in every field yourself",
        d: "Since BambooHR doesn't parse resumes by default, nothing autofills your work history or education from the file you upload. Type the application form as carefully as you'd write the resume itself.",
      },
      {
        t: "Attach a resume anyway",
        d: "Even without native parsing, most BambooHR career pages still take a resume or cover letter upload. A recruiter opens and reads it directly, so it still needs to look right.",
      },
      {
        t: "Keep your details consistent for this employer",
        d: "Each company's BambooHR careers page is its own application. Use the same name, phone number and email you'd want matched to a prior application with that company.",
      },
      {
        t: "Don't resubmit the same application repeatedly",
        d: "BambooHR's help pages describe a cap on repeat applications with the same name, phone number or email on one opening. If you need to change something, look for an edit or withdraw option instead of applying again.",
      },
    ],
    checklist: [
      "Every field in the form filled in by hand, not left for parsing",
      "Resume or cover letter attached where the form allows it",
      "Consistent name, phone number and email used for this employer",
      "Dates and job titles typed exactly as on your resume",
      "No more than one application sent for the same opening",
      "Status checked before reapplying to the same job",
    ],
    faqs: [
      {
        q: "Does BambooHR parse my resume into the application?",
        a: "Not by default. BambooHR's own Hiring FAQ says it doesn't offer resume parsing, and that some employers add it through a Marketplace partner integration instead. Fill in the application form yourself rather than relying on the resume to do it.",
      },
      {
        q: "Why was my application blocked after I tried to resend it?",
        a: "BambooHR's help pages describe a cap on repeat applications to the same opening, based on matching name, phone number or email, though the two pages give slightly different thresholds. If you think you've hit that limit, contact the employer instead of reapplying again.",
      },
      {
        q: "Can I apply on a company's own website instead of its careers page?",
        a: "If the employer embeds BambooHR's application form on its own site, yes. BambooHR's help center describes both the hosted careers page and an embedded version as the same underlying form.",
      },
      {
        q: "What does it mean if I'm marked \"Added\" instead of \"Applied\"?",
        a: "BambooHR's help center says that label means a recruiter entered you into the pipeline by hand rather than you submitting an application yourself.",
      },
    ],
    sources: [
      {
        title: "Hiring FAQ",
        publisher: "BambooHR Help Center",
        url: "https://bamboohr.screenstepslive.com/m/53914/l/1487007-hiring-faq",
        checked: C,
      },
      {
        title: "How Does a Candidate Apply for a Job Opening?",
        publisher: "BambooHR Help Center",
        url: "https://bamboohr.screenstepslive.com/m/53914/l/587666-how-does-a-candidate-apply-for-a-job-opening",
        checked: C,
      },
      {
        title: "Candidate's Profile",
        publisher: "BambooHR Help Center",
        url: "https://bamboohr.screenstepslive.com/m/53914/l/587645-candidate-s-profile",
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
