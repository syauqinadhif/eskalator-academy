import type { Chapter } from '@/types/mission'

export const CHAPTERS: Chapter[] = [
  {
    id: 'ch1',
    title: 'Variables & Data Types',
    subtitle: 'Boot Sequence',
    storyBlurb:
      'Boot up the ESKALATOR system. Learn to store and check patient data before the pipeline goes live.',
    isBuilt: true,
    missions: [
      {
        id: 'c1m1',
        chapterId: 'ch1',
        title: 'First Reading',
        xp: 100,
        story:
          `The ICU monitor just powered on. Your first task: store the SpO₂ reading into a variable so the pipeline can process it.\n\nPatient data incoming — value: 98.`,
        starterCode: `# Store the SpO2 reading (value: 98) into a variable called spo2\nspo2 = `,
        tests: [
          { code: `assert spo2 == 98, "spo2 should equal 98"`, label: 'Value is 98' },
          { code: `assert type(spo2) == int, "spo2 must be an integer"`, label: 'Type is int' },
        ],
        hints: [
          'In Python, assign values with =. Example: heart_rate = 72',
          'The variable must be named exactly `spo2` with the value 98',
          'Full answer: spo2 = 98',
        ],
      },
      {
        id: 'c1m2',
        chapterId: 'ch1',
        title: 'Patient Name',
        xp: 100,
        story:
          `Patient admitted to Bay 3. The system needs to log the patient's name as a string variable so it can appear on the monitor display.`,
        starterCode: `# Store the patient name "Budi Santoso" in a variable called patient_name\npatient_name = `,
        tests: [
          {
            code: `assert patient_name == "Budi Santoso", "patient_name should be 'Budi Santoso'"`,
            label: 'Name is "Budi Santoso"',
          },
          {
            code: `assert type(patient_name) == str, "patient_name must be a string"`,
            label: 'Type is str',
          },
        ],
        hints: [
          'Strings in Python are wrapped in quotes. Example: name = "John"',
          'The variable must be named exactly `patient_name`',
          'Full answer: patient_name = "Budi Santoso"',
        ],
      },
      {
        id: 'c1m3',
        chapterId: 'ch1',
        title: 'Normal Range',
        xp: 120,
        story:
          `The system needs to define the normal SpO₂ threshold. A reading is considered normal if it is at or above 95.0%. Store this threshold and check whether the current reading (98.5) is within range.`,
        starterCode: `# Define the threshold (95.0) and check if reading 98.5 is normal\nthreshold = \nreading = 98.5\nis_normal = `,
        tests: [
          {
            code: `assert threshold == 95.0, "threshold should be 95.0"`,
            label: 'Threshold is 95.0',
          },
          {
            code: `assert type(threshold) == float, "threshold must be a float"`,
            label: 'Threshold is float',
          },
          {
            code: `assert is_normal == True, "is_normal should be True when reading >= threshold"`,
            label: 'is_normal is True',
          },
        ],
        hints: [
          'Floats have a decimal point: threshold = 95.0',
          'Use the >= comparison operator to check if reading is at or above threshold',
          'Full answer: threshold = 95.0  and  is_normal = reading >= threshold',
        ],
      },
      {
        id: 'c1m4',
        chapterId: 'ch1',
        title: 'Status Check',
        xp: 150,
        story:
          `The monitor must display a patient status based on their SpO₂. If SpO₂ is below 90, status is "CRITICAL". Otherwise, status is "STABLE". The current reading is 87.`,
        starterCode: `# Set status based on spo2 value (87)\nspo2 = 87\n\n# Write an if/else to set the status variable\n`,
        tests: [
          {
            code: `assert spo2 == 87, "spo2 should be 87"`,
            label: 'spo2 is 87',
          },
          {
            code: `assert status == "CRITICAL", "status should be 'CRITICAL' when spo2 < 90"`,
            label: 'Status is "CRITICAL"',
          },
          {
            code: `assert type(status) == str, "status must be a string"`,
            label: 'Type is str',
          },
        ],
        hints: [
          'Use if/else: if spo2 < 90: ... else: ...',
          'Assign the string "CRITICAL" or "STABLE" to a variable called `status`',
          'Full answer:\nif spo2 < 90:\n    status = "CRITICAL"\nelse:\n    status = "STABLE"',
        ],
      },
      {
        id: 'c1m5',
        chapterId: 'ch1',
        title: 'Two Vitals',
        xp: 150,
        story:
          `The ESKALATOR pipeline processes two vitals simultaneously: SpO₂ and heart rate. Store both and format a display string that reads "SpO2: 96 | HR: 72 bpm" using an f-string.`,
        starterCode: `# Store spo2 = 96 and heart_rate = 72\n# Then create a display string using an f-string\nspo2 = \nheart_rate = \ndisplay = `,
        tests: [
          { code: `assert spo2 == 96`, label: 'spo2 is 96' },
          { code: `assert heart_rate == 72`, label: 'heart_rate is 72' },
          {
            code: `assert display == "SpO2: 96 | HR: 72 bpm", "display string format is wrong"`,
            label: 'Display string correct',
          },
        ],
        hints: [
          'F-strings start with f before the quote: f"text {variable}"',
          'The exact format needed: f"SpO2: {spo2} | HR: {heart_rate} bpm"',
          'Full answer:\nspo2 = 96\nheart_rate = 72\ndisplay = f"SpO2: {spo2} | HR: {heart_rate} bpm"',
        ],
      },
    ],
  },
  {
    id: 'ch2',
    title: 'Lists, Dicts & Loops',
    subtitle: 'Data Processing',
    storyBlurb:
      'The monitor has been running for hours. Now process a batch of 10 patient readings and extract meaningful data.',
    isBuilt: true,
    missions: [
      {
        id: 'c2m1',
        chapterId: 'ch2',
        title: 'Reading Log',
        xp: 100,
        story:
          `The ESKALATOR system has captured 10 SpO₂ readings over the last hour. Store them in a list called readings. Values: 98, 97, 99, 96, 98, 95, 97, 98, 99, 96.`,
        starterCode: `# Create a list called readings with the 10 SpO2 values\nreadings = `,
        tests: [
          {
            code: `assert readings == [98, 97, 99, 96, 98, 95, 97, 98, 99, 96]`,
            label: 'List has correct values',
          },
          {
            code: `assert type(readings) == list`,
            label: 'Type is list',
          },
          {
            code: `assert len(readings) == 10`,
            label: 'List has 10 items',
          },
        ],
        hints: [
          'Lists in Python use square brackets: readings = [1, 2, 3]',
          'Separate each value with a comma',
          'Full answer: readings = [98, 97, 99, 96, 98, 95, 97, 98, 99, 96]',
        ],
      },
      {
        id: 'c2m2',
        chapterId: 'ch2',
        title: 'Last Reading',
        xp: 100,
        story:
          `The monitor needs to display the most recent SpO₂ value. Access the last item in the readings list and store it in a variable called latest.`,
        starterCode: `readings = [98, 97, 99, 96, 98, 95, 97, 98, 99, 96]\n\n# Get the last item and store it in latest\nlatest = `,
        tests: [
          {
            code: `assert latest == 96, "latest should be the last item: 96"`,
            label: 'latest is 96',
          },
          {
            code: `assert type(latest) == int`,
            label: 'Type is int',
          },
        ],
        hints: [
          'Use an index to access list items. Python lists start at index 0',
          'To get the last item, use index -1: readings[-1]',
          'Full answer: latest = readings[-1]',
        ],
      },
      {
        id: 'c2m3',
        chapterId: 'ch2',
        title: 'Average SpO₂',
        xp: 150,
        story:
          `The clinical dashboard needs the average SpO₂ reading. Calculate the average from the readings list and store it as average. Use a loop or built-in functions.`,
        starterCode: `readings = [98, 97, 99, 96, 98, 95, 97, 98, 99, 96]\n\n# Calculate the average and store in average\naverage = `,
        tests: [
          {
            code: `assert average == 97.3, f"average should be 97.3, got {average}"`,
            label: 'Average is 97.3',
          },
          {
            code: `assert type(average) == float, "average must be a float"`,
            label: 'Type is float',
          },
        ],
        hints: [
          'The average is sum of all values divided by the count',
          'Python has built-in sum() and len() functions: sum(readings) / len(readings)',
          'Full answer: average = sum(readings) / len(readings)',
        ],
      },
      {
        id: 'c2m4',
        chapterId: 'ch2',
        title: 'Patient Record',
        xp: 150,
        story:
          `Create a patient record as a dictionary. The patient is "Siti Rahayu", age 45, with SpO₂ 97. The dict must have keys: "name", "age", "spo2".`,
        starterCode: `# Create a dictionary called patient with the required fields\npatient = `,
        tests: [
          {
            code: `assert type(patient) == dict`,
            label: 'Type is dict',
          },
          {
            code: `assert patient["name"] == "Siti Rahayu"`,
            label: '"name" is "Siti Rahayu"',
          },
          {
            code: `assert patient["age"] == 45`,
            label: '"age" is 45',
          },
          {
            code: `assert patient["spo2"] == 97`,
            label: '"spo2" is 97',
          },
        ],
        hints: [
          'Dictionaries use curly braces with key: value pairs: {"key": value}',
          'String keys must be in quotes. Separate pairs with commas',
          'Full answer: patient = {"name": "Siti Rahayu", "age": 45, "spo2": 97}',
        ],
      },
      {
        id: 'c2m5',
        chapterId: 'ch2',
        title: 'Flag Abnormal',
        xp: 200,
        story:
          `Critical task: the system must flag all abnormal readings. A reading is abnormal if it is below 96. Loop through the readings list and collect all abnormal values into a list called abnormal.`,
        starterCode: `readings = [98, 97, 99, 96, 98, 95, 97, 98, 99, 96]\n\n# Find all readings below 96 and store them in abnormal list\nabnormal = []\n`,
        tests: [
          {
            code: `assert type(abnormal) == list`,
            label: 'Type is list',
          },
          {
            code: `assert abnormal == [95], f"abnormal should be [95], got {abnormal}"`,
            label: 'abnormal is [95]',
          },
          {
            code: `assert len(abnormal) == 1`,
            label: 'One abnormal reading found',
          },
        ],
        hints: [
          'Use a for loop: for reading in readings:',
          'Inside the loop, use an if statement to check if reading < 96, then append to abnormal',
          'Full answer:\nfor reading in readings:\n    if reading < 96:\n        abnormal.append(reading)',
        ],
      },
    ],
  },
  {
    id: 'ch3',
    title: 'Functions & Conditions',
    subtitle: 'Coming Soon',
    storyBlurb: 'Build reusable diagnostic functions for the ESKALATOR pipeline.',
    isBuilt: false,
    missions: [],
  },
  {
    id: 'ch4',
    title: 'File I/O & JSON',
    subtitle: 'Coming Soon',
    storyBlurb: 'Read and write patient records as JSON data files.',
    isBuilt: false,
    missions: [],
  },
  {
    id: 'ch5',
    title: 'Image Processing',
    subtitle: 'Coming Soon',
    storyBlurb: 'Process ICU monitor images with OpenCV and the Florence-2 VLM.',
    isBuilt: false,
    missions: [],
  },
]

export function getMission(missionId: string) {
  for (const ch of CHAPTERS) {
    const m = ch.missions.find((m) => m.id === missionId)
    if (m) return m
  }
  return null
}

export function getChapter(chapterId: string) {
  return CHAPTERS.find((c) => c.id === chapterId) ?? null
}

export const ALL_MISSIONS = CHAPTERS.flatMap((ch) => ch.missions)
