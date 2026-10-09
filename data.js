/* ==========================================================================
   CONTENT FILE — edit this file to change the questions and advice.
   You do not need to touch any other file to change the medical content.

   Symptom grading follows NCI CTCAE v6.0 (published July 2025).
   Patient-friendly wording replaces CTCAE terms:
     "limiting instrumental ADL" → "stops me cooking, doing housework, shopping or going out"
     "limiting self-care ADL"    → "I need help washing, dressing, eating or using the toilet"

   Each answer can have:
     grade : the CTCAE grade (0 = none, 1 mild, 2 moderate, 3 severe, 4 life-threatening)
     level : (optional) the triage colour, which OVERRIDES the grade mapping below
               0 = GREEN → manage at home
               1 = AMBER → call the palliative care team today
               2 = RED   → come to hospital / call emergency now
     note  : (optional) the reason shown to the patient

   Questions WITH "ctcae" are graded and appear in the clinician summary.
   Questions WITHOUT "ctcae" are extra safety checks — give their answers a "level".

   The final result is the HIGHEST triage level of any answer.
   ========================================================================== */

const SETTINGS = {
  careTeamName: "Palliative Care Team",
  careTeamPhone: "+91 00000 00000",   // ← put your team's phone number here
  emergencyNumber: "112",             // ← local emergency number
  hospitalName: "the hospital",

  // CTCAE grade → triage colour (index = grade)
  //                 G0  G1  G2  G3  G4
  gradeToLevel:    [ 0,  0,  1,  2,  2 ],
};

const GRADE_NAMES = ["None", "Mild", "Moderate", "Severe", "Life-threatening"];

/* Shown first. If the patient has ANY of these, they go straight to RED. */
const RED_FLAGS = [
  "Severe difficulty breathing, or breathing that suddenly got much worse",
  "Chest pain",
  "Heavy bleeding that won't stop, or vomiting / coughing up blood",
  "A fit (seizure), fainting, or being very hard to wake up",
  "Sudden new confusion",
  "Sudden weakness or numbness in the legs, or losing control of bladder or bowels",
  "Temperature of 38°C or higher (or 37.5°C or higher after chemotherapy in the last 6 weeks)",
  "Swelling of the face or neck together with breathlessness",
  "Thoughts of harming yourself or ending your life",
];

/* Symptoms. "color" can be: mint, sky, lavender, peach, pink, lemon */
const SYMPTOMS = [
  {
    id: "pain",
    name: "Pain",
    icon: "🩹",
    color: "peach",
    questions: [
      {
        ctcae: "Pain",
        q: "How much is the pain affecting your day?",
        options: [
          { label: "Mild — I can still do my usual activities", grade: 1 },
          { label: "Moderate — it stops me cooking, doing housework, shopping or going out", grade: 2, note: "Moderate pain that limits your activities should be reviewed by your team today." },
          { label: "Severe — I need help washing, dressing, eating or using the toilet", grade: 3, note: "Severe pain needs urgent assessment." },
        ],
      },
      {
        q: "Is this a new pain, or different from your usual pain?",
        options: [
          { label: "No, it's my usual pain", level: 0 },
          { label: "Yes, it's new or different", level: 1, note: "A new type of pain should be checked by your team." },
        ],
      },
      {
        q: "Did your extra (breakthrough) pain medicine help?",
        options: [
          { label: "Yes, it helped", level: 0 },
          { label: "I haven't taken it yet", level: 0 },
          { label: "No, or I needed more than 3 extra doses today", level: 1, note: "Your regular pain medicines may need adjusting." },
        ],
      },
      {
        q: "Do you have new back pain with leg weakness, numbness, or trouble passing urine or stool?",
        options: [
          { label: "No", level: 0 },
          { label: "Yes", level: 2, note: "These signs can mean pressure on the spinal cord and must be seen immediately." },
        ],
      },
    ],
    homeCare: [
      "Take your breakthrough pain medicine exactly as your team prescribed.",
      "Try a warm (not hot) pack or a comfortable change of position.",
      "Rest in a calm, quiet place and try slow breathing.",
      "Write down when the pain started and what helped — share this with your team.",
      "Never take more than the dose your team has advised.",
    ],
  },

  {
    id: "breath",
    name: "Breathlessness",
    icon: "🌬️",
    color: "sky",
    questions: [
      {
        ctcae: "Dyspnea",
        q: "When do you feel breathless?",
        options: [
          { label: "Only when walking fast or climbing stairs", grade: 1 },
          { label: "With light activity — it stops me doing housework, cooking or shopping", grade: 2, note: "Breathlessness with light activity should be reviewed today." },
          { label: "Even at rest — I need help washing or dressing", grade: 3, note: "Breathlessness at rest needs urgent help." },
          { label: "I'm struggling to breathe and can't speak in sentences", grade: 4, note: "This is a medical emergency." },
        ],
      },
      {
        q: "Did the breathlessness come on suddenly?",
        options: [
          { label: "No, it's gradual or my usual", level: 0 },
          { label: "Yes, it came on suddenly", level: 2, note: "Sudden breathlessness can be a sign of a blood clot or other emergency." },
        ],
      },
      {
        q: "Do you also have chest pain, or are you coughing up blood?",
        options: [
          { label: "No", level: 0 },
          { label: "Yes", level: 2, note: "Chest pain or coughing blood needs immediate assessment." },
        ],
      },
      {
        q: "Do you have a fever or a cough with coloured phlegm?",
        options: [
          { label: "No", level: 0 },
          { label: "Yes", level: 1, note: "You may have a chest infection that needs treatment." },
        ],
      },
    ],
    homeCare: [
      "Sit upright, leaning slightly forward, with your arms resting on a table or pillow.",
      "Use a handheld fan towards your face, or open a window.",
      "Breathe in through your nose and out slowly through pursed lips.",
      "Use your prescribed inhalers, medicines or oxygen as your team advised.",
      "Pace yourself — rest between activities.",
    ],
  },

  {
    id: "nausea",
    name: "Nausea & vomiting",
    icon: "🤢",
    color: "mint",
    questions: [
      {
        ctcae: "Nausea",
        q: "How is the sickness affecting your eating and drinking?",
        options: [
          { label: "I don't feel sick", grade: 0 },
          { label: "I feel sick, but I'm eating and drinking as usual", grade: 1 },
          { label: "I'm eating and drinking less than usual", grade: 2, note: "Reduced eating and drinking because of nausea should be reviewed today." },
          { label: "I'm hardly eating or drinking anything", grade: 3, note: "Not eating or drinking enough can quickly become dangerous." },
        ],
      },
      {
        // CTCAE v6.0 grades vomiting by the treatment needed, not by number of episodes
        ctcae: "Vomiting",
        q: "Are you vomiting?",
        options: [
          { label: "No", grade: 0 },
          { label: "Yes, but I can keep fluids and medicines down", grade: 1 },
          { label: "Yes, often — I can only keep small sips down", grade: 2, note: "You may need a change of anti-sickness medicine or fluids through a drip." },
          { label: "I can't keep anything down, including my medicines", grade: 3, note: "You may need hospital treatment for vomiting." },
        ],
      },
      {
        ctcae: "Dehydration",
        q: "How is your thirst and urine?",
        options: [
          { label: "Normal", grade: 0 },
          { label: "Dry mouth and thirsty", grade: 1 },
          { label: "Dizzy when standing, or passing very little urine", grade: 2, note: "These can be signs of dehydration that may need a drip." },
        ],
      },
      {
        q: "Is the vomit green, dark brown, bloody, or like coffee grounds — or is your tummy swollen and you can't open your bowels?",
        options: [
          { label: "No", level: 0 },
          { label: "Yes", level: 2, note: "These can be signs of a bowel blockage or bleeding." },
        ],
      },
    ],
    homeCare: [
      "Take your anti-sickness medicine as prescribed, ideally 30 minutes before meals.",
      "Take small, frequent sips of water, clear fluids or oral rehydration solution.",
      "Eat small, plain meals (toast, crackers, rice) when you feel able.",
      "Avoid strong smells, greasy and very sweet foods.",
      "Get fresh air and rest sitting up after eating.",
    ],
  },

  {
    id: "constipation",
    name: "Constipation",
    icon: "🌀",
    color: "lemon",
    questions: [
      {
        ctcae: "Constipation",
        q: "How would you describe your constipation?",
        options: [
          { label: "Now and then — I manage with diet or an occasional laxative", grade: 1 },
          { label: "Most days, even with regular laxatives — it limits my daily activities", grade: 2, note: "Your laxatives may need adjusting." },
          { label: "Severe — I can't empty my bowels without help, and need help with self-care", grade: 3, note: "Severe constipation may need treatment by a nurse or doctor today." },
        ],
      },
      {
        q: "When did you last open your bowels?",
        options: [
          { label: "Within the last 2 days", level: 0 },
          { label: "3 or more days ago", level: 1, note: "Not opening your bowels for 3 days needs review, especially if you take strong pain medicines." },
        ],
      },
      {
        q: "Are you vomiting, is your tummy swollen and painful, or are you unable to pass wind?",
        options: [
          { label: "No", level: 0 },
          { label: "Yes", level: 2, note: "These can be signs of a bowel blockage and need urgent assessment." },
        ],
      },
    ],
    homeCare: [
      "Keep taking your laxatives as prescribed — especially if you take strong pain medicines.",
      "Drink plenty of fluids through the day, if you are able.",
      "Gentle movement, such as short walks, can help.",
      "Use a footstool to raise your knees when sitting on the toilet.",
      "Include fruit, vegetables or prunes if you're eating well.",
    ],
  },

  {
    id: "diarrhoea",
    name: "Diarrhoea",
    icon: "💧",
    color: "sky",
    questions: [
      {
        ctcae: "Diarrhea",
        q: "Compared with normal for you, how many extra stools have you had in 24 hours?",
        options: [
          { label: "Looser than usual, or up to 3 extra", grade: 1 },
          { label: "4 to 6 extra, or it's stopping me doing daily tasks", grade: 2, note: "Moderate diarrhoea can cause dehydration and should be reviewed today." },
          { label: "7 or more extra, or I need help with self-care", grade: 3, note: "Severe diarrhoea needs urgent assessment and may need fluids through a drip." },
          { label: "I feel faint, confused or extremely weak", grade: 4, note: "This is a medical emergency." },
        ],
      },
      {
        q: "Is there blood in your stool, or do you have a fever?",
        options: [
          { label: "No", level: 0 },
          { label: "Yes", level: 2, note: "Blood in stool or fever with diarrhoea needs urgent review." },
        ],
      },
    ],
    homeCare: [
      "Sip fluids often — water or oral rehydration solution.",
      "Eat small, plain meals; avoid dairy, spicy and fatty food for now.",
      "If you take laxatives, ask your team whether you should pause them.",
      "Keep the skin around your bottom clean and dry.",
    ],
  },

  {
    id: "fever",
    name: "Fever",
    icon: "🌡️",
    color: "pink",
    questions: [
      {
        ctcae: "Fever",
        q: "What is your temperature?",
        options: [
          { label: "Below 38.0°C", grade: 0 },
          // In people with cancer any fever needs a same-day call, so grade 1 is raised to amber
          { label: "38.0°C – 39.0°C", grade: 1, level: 1, note: "A fever should be reviewed by your team today." },
          { label: "39.1°C – 40.0°C", grade: 2, level: 2, note: "A high fever can be a sign of serious infection." },
          { label: "Above 40.0°C", grade: 3, note: "A very high fever is an emergency." },
        ],
      },
      {
        q: "Have you had chemotherapy or immunotherapy in the last 6 weeks, AND is your temperature 37.5°C or higher?",
        options: [
          { label: "No", level: 0 },
          { label: "Yes", level: 2, note: "Fever after recent cancer treatment can mean a low white cell count with infection (febrile neutropenia). This is an emergency." },
        ],
      },
      {
        q: "Are you shivering, feeling very unwell, or is your heart racing?",
        options: [
          { label: "No", level: 0 },
          { label: "Yes", level: 2, note: "These can be signs of a serious infection (sepsis)." },
        ],
      },
    ],
    homeCare: [
      "Re-check your temperature in 1 hour and write it down.",
      "Drink plenty of fluids.",
      "Wear light clothing and keep the room comfortably cool.",
      "Check your temperature before taking paracetamol — it can hide a fever.",
      "If your temperature rises, call your team straight away.",
    ],
  },

  {
    id: "confusion",
    name: "Confusion or drowsiness",
    icon: "💭",
    color: "lavender",
    questions: [
      {
        ctcae: "Delirium",
        q: "How did the confusion start?",
        options: [
          { label: "There is no confusion", grade: 0 },
          { label: "Slowly over several days", grade: 1, level: 1, note: "Any new confusion should be checked by your team today." },
          { label: "Suddenly — within hours or a day", grade: 3, note: "Sudden (new onset) confusion can have treatable causes and needs urgent assessment." },
        ],
      },
      {
        ctcae: "Confusion",
        q: "How confused is the person?",
        options: [
          { label: "Not confused", grade: 0 },
          { label: "Mildly muddled at times, but managing", grade: 1 },
          { label: "Can't manage tasks like cooking, money or medicines", grade: 2, note: "Moderate confusion should be reviewed today." },
          { label: "Needs help with washing, dressing or eating", grade: 3, note: "Severe confusion needs urgent assessment." },
          { label: "Agitated and a danger to themselves or others", grade: 4, note: "This needs emergency care." },
        ],
      },
      {
        ctcae: "Somnolence",
        q: "How sleepy is the person?",
        options: [
          { label: "Normal for them", grade: 0 },
          { label: "A bit sleepier than usual", grade: 1 },
          { label: "Sleeping much of the day and needs help with daily tasks", grade: 2, note: "Increased drowsiness can be caused by medicines or infection." },
          { label: "Very hard to wake — only responds to loud voice or touch", grade: 3, note: "This needs urgent assessment." },
        ],
      },
      {
        q: "Are they very thirsty, passing lots of urine, or constipated?",
        options: [
          { label: "No", level: 0 },
          { label: "Yes", level: 1, note: "These can be signs of high calcium, which needs a blood test." },
        ],
      },
    ],
    homeCare: [
      "Keep the room calm, quiet and well lit during the day.",
      "Have familiar people nearby and speak in short, simple sentences.",
      "Keep glasses and hearing aids on, and a clock visible.",
      "Do not leave the person alone if they are unsafe.",
    ],
  },

  {
    id: "mouth",
    name: "Mouth problems",
    icon: "👄",
    color: "pink",
    questions: [
      {
        ctcae: "Mucositis oral",
        q: "How sore is your mouth?",
        options: [
          { label: "Not sore", grade: 0 },
          { label: "Mildly sore, but I'm eating normally", grade: 1 },
          { label: "Painful or ulcers — I need soft food, but can still eat", grade: 2, note: "Your team can treat a sore mouth and prescribe pain relief." },
          { label: "So painful I can't eat or drink properly", grade: 3, note: "Severe mouth pain that stops you eating or drinking needs urgent care." },
        ],
      },
      {
        ctcae: "Dysphagia",
        q: "How is your swallowing?",
        options: [
          { label: "Normal", grade: 0 },
          { label: "Uncomfortable, but I can eat my normal diet", grade: 1 },
          { label: "I've had to change to soft or liquid food", grade: 2, note: "Difficulty swallowing should be reviewed by your team." },
          { label: "I can barely swallow, even fluids", grade: 3, note: "Not being able to swallow fluids can quickly lead to dehydration." },
        ],
      },
      {
        q: "Do you have white patches in your mouth?",
        options: [
          { label: "No", level: 0 },
          { label: "Yes", level: 1, note: "This may be oral thrush, which can be treated." },
        ],
      },
    ],
    homeCare: [
      "Brush gently with a soft toothbrush twice a day.",
      "Rinse with salt water (½ teaspoon of salt in a glass of warm water) several times a day.",
      "Avoid alcohol-based mouthwashes and very spicy or acidic foods.",
      "Sip water often and use lip balm.",
    ],
  },

  {
    id: "fatigue",
    name: "Tiredness & weakness",
    icon: "🌙",
    color: "lavender",
    questions: [
      {
        ctcae: "Fatigue",
        q: "How would you describe your tiredness?",
        options: [
          { label: "Tired, but rest helps", grade: 1 },
          { label: "Rest doesn't help — I can't do housework, cooking or shopping", grade: 2, note: "Tiredness that limits your activities should be reviewed by your team." },
          // In palliative care severe fatigue is often expected, so grade 3 goes to amber rather than red
          { label: "Rest doesn't help — I need help washing, dressing or eating", grade: 3, level: 1, note: "Severe tiredness should be discussed with your team today." },
        ],
      },
      {
        q: "Has it got worse quickly over the last few days?",
        options: [
          { label: "No", level: 0 },
          { label: "Yes", level: 1, note: "Rapidly worsening tiredness can have treatable causes." },
        ],
      },
      {
        q: "Do you have sudden weakness in your arms or legs, or can you suddenly no longer stand?",
        options: [
          { label: "No", level: 0 },
          { label: "Yes", level: 2, note: "Sudden weakness needs immediate assessment." },
        ],
      },
    ],
    homeCare: [
      "Plan your day — do important things when you have the most energy.",
      "Rest between activities and accept help from others.",
      "Light activity, such as a short walk, can sometimes help.",
      "Keep a regular sleep routine.",
    ],
  },

  {
    id: "bleeding",
    name: "Bleeding",
    icon: "🩸",
    color: "peach",
    questions: [
      {
        ctcae: "Hemorrhage (site-specific)",
        q: "How much bleeding is there?",
        options: [
          { label: "A small amount that stopped on its own", grade: 1 },
          { label: "It keeps coming back, or needed treatment like a dressing or nose packing", grade: 2, note: "Ongoing bleeding should be checked by your team today." },
          { label: "Heavy, or it won't stop after 10 minutes of pressure", grade: 3, note: "Heavy bleeding needs hospital care." },
          { label: "Very heavy, and I feel faint or have collapsed", grade: 4, note: "This is a medical emergency." },
        ],
      },
      {
        q: "Are you vomiting or coughing up blood, or passing black, sticky stools?",
        options: [
          { label: "No", level: 0 },
          { label: "Yes", level: 2, note: "This can mean internal bleeding." },
        ],
      },
      {
        q: "Do you take blood thinners?",
        options: [
          { label: "No", level: 0 },
          { label: "Yes", level: 1, note: "Your blood thinner dose may need checking." },
        ],
      },
    ],
    homeCare: [
      "Press firmly on the bleeding area with a clean cloth for 10 minutes.",
      "For a nosebleed, sit forward and pinch the soft part of your nose.",
      "Keep dark-coloured towels nearby.",
      "Call your team if bleeding starts again.",
    ],
  },

  {
    id: "swelling",
    name: "Swelling",
    icon: "🦵",
    color: "mint",
    questions: [
      {
        ctcae: "Edema limbs",
        q: "Is there swelling in your legs or arms?",
        options: [
          { label: "No", grade: 0 },
          { label: "Mild — only noticeable when I look closely", grade: 1 },
          { label: "Clearly swollen — it stops me doing housework or going out", grade: 2, note: "Your team can help manage swelling." },
          // Long-standing swelling is common in palliative care, so grade 3 goes to amber rather than red
          { label: "Severe — I need help washing or dressing because of it", grade: 3, level: 1, note: "Severe swelling should be reviewed by your team today." },
        ],
      },
      {
        ctcae: "Ascites",
        q: "Is your tummy swollen?",
        options: [
          { label: "No", grade: 0 },
          { label: "Swollen and uncomfortable", grade: 2, note: "Fluid in the tummy can often be drained to make you comfortable." },
          { label: "Very swollen — it's making it hard to breathe or eat", grade: 3, level: 1, note: "Your team may need to arrange a drain soon." },
        ],
      },
      {
        q: "Is one leg suddenly swollen, painful, warm or red?",
        options: [
          { label: "No", level: 0 },
          { label: "Yes", level: 1, note: "Swelling in one leg can be a blood clot and should be checked today." },
        ],
      },
      {
        q: "Is your face, neck or arm swollen, with headache or breathlessness?",
        options: [
          { label: "No", level: 0 },
          { label: "Yes", level: 2, note: "This can be a sign of a blocked vein in the chest (superior vena cava obstruction) and is an emergency." },
        ],
      },
    ],
    homeCare: [
      "Raise your legs on a pillow when sitting or lying down.",
      "Move your ankles and feet gently through the day.",
      "Keep the skin clean and moisturised, and check for broken areas.",
      "Avoid tight clothing and socks.",
    ],
  },

  {
    id: "mood",
    name: "Anxiety or low mood",
    icon: "🌱",
    color: "mint",
    questions: [
      {
        ctcae: "Suicidal ideation",
        q: "Have you been having thoughts about death or ending your life?",
        options: [
          { label: "No", grade: 0 },
          { label: "I think about death more, but I don't want to die", grade: 1, level: 1, note: "It's common to think about death. Talking to your team can really help." },
          { label: "I have thoughts of ending my life, but no plan", grade: 2, level: 2, note: "You deserve support right now. Please reach out for urgent help — you don't have to face this alone." },
          { label: "I have a plan to end my life", grade: 3, note: "Please get help right now. You don't have to face this alone." },
        ],
      },
      {
        ctcae: "Anxiety",
        q: "How much is worry or anxiety affecting you?",
        options: [
          { label: "Not at all", grade: 0 },
          { label: "Mildly — I'm coping", grade: 1 },
          { label: "Moderately — it stops me doing everyday tasks", grade: 2, note: "Your team can offer support, counselling or medicines that may help." },
          { label: "Severely — I can't look after myself", grade: 3, level: 1, note: "Severe anxiety needs support from your team today." },
        ],
      },
      {
        ctcae: "Depression",
        q: "How low has your mood been?",
        options: [
          { label: "Not low", grade: 0 },
          { label: "A little low", grade: 1 },
          { label: "Low enough that it stops me doing everyday tasks", grade: 2, note: "Low mood can be treated — your team can help." },
          { label: "So low I can't look after myself", grade: 3, level: 1, note: "Severe low mood needs support from your team today." },
        ],
      },
    ],
    homeCare: [
      "Talk to someone you trust about how you feel.",
      "Try slow breathing: in for 4 seconds, out for 6 seconds.",
      "Keep a simple daily routine and spend a little time outside if you can.",
      "Let your team know at your next contact — emotional support is part of your care.",
    ],
  },
];
