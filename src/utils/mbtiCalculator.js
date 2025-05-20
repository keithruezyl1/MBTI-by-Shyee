// Function to calculate MBTI type from answers
export const calculateMBTI = (answers, questions) => {
  // Initialize scores for each pole
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };

  // Track skipped questions for debugging
  const skippedQuestions = [];

  questions.forEach(question => {
    const answer = parseInt(answers[question.id]);
    if (isNaN(answer)) {
      skippedQuestions.push({ id: question.id, reason: 'Invalid answer' });
      return;
    }

    const { dimension, direction } = question;
    
    // Validate dimension
    if (!['EI', 'SN', 'TF', 'JP'].includes(dimension)) {
      skippedQuestions.push({ 
        id: question.id, 
        reason: `Invalid dimension: ${dimension}` 
      });
      return;
    }
    
    // Find the opposite pole
    let poles;
    switch (dimension) {
      case 'EI': poles = ['E', 'I']; break;
      case 'SN': poles = ['S', 'N']; break;
      case 'TF': poles = ['T', 'F']; break;
      case 'JP': poles = ['J', 'P']; break;
    }
    
    // Validate direction
    if (!poles.includes(direction)) {
      skippedQuestions.push({ 
        id: question.id, 
        reason: `Invalid direction '${direction}' for dimension '${dimension}'` 
      });
      return;
    }
    
    const [poleA, poleB] = poles;
    const weight = question.weight || 1; // Support for custom question weighting
    
    // If direction matches poleA, then poleA is the direction, else poleB
    if (direction === poleA) {
      // For poleA, higher answers (4-5) mean more of poleA, lower answers (1-2) mean more of poleB
      if (answer === 5) {
        scores[poleA] += 2 * weight; // Strong agreement
      } else if (answer === 4) {
        scores[poleA] += 1 * weight; // Agreement
      } else if (answer === 3) {
        scores[poleA] += 0.5 * weight; // Neutral - split between poles
        scores[poleB] += 0.5 * weight;
      } else if (answer === 2) {
        scores[poleB] += 1 * weight; // Disagreement
      } else if (answer === 1) {
        scores[poleB] += 2 * weight; // Strong disagreement
      }
    } else {
      // For poleB, higher answers (4-5) mean more of poleB, lower answers (1-2) mean more of poleA
      if (answer === 5) {
        scores[poleB] += 2 * weight; // Strong agreement
      } else if (answer === 4) {
        scores[poleB] += 1 * weight; // Agreement
      } else if (answer === 3) {
        scores[poleA] += 0.5 * weight; // Neutral - split between poles
        scores[poleB] += 0.5 * weight;
      } else if (answer === 2) {
        scores[poleA] += 1 * weight; // Disagreement
      } else if (answer === 1) {
        scores[poleA] += 2 * weight; // Strong disagreement
      }
    }
  });

  // Log any skipped questions for debugging
  if (skippedQuestions.length > 0) {
    console.warn('Skipped questions:', skippedQuestions);
  }

  // Determine the type with tie-breaking
  const type = [
    handleTie(scores.E, scores.I, 'E', 'I'),
    handleTie(scores.S, scores.N, 'S', 'N'),
    handleTie(scores.T, scores.F, 'T', 'F'),
    handleTie(scores.J, scores.P, 'J', 'P')
  ].join('');

  // Return both the type and raw scores for debugging/display
  return {
    type,
    scores,
    skippedQuestions: skippedQuestions.length > 0 ? skippedQuestions : undefined
  };
};

// Helper function to handle ties
const handleTie = (scoreA, scoreB, poleA, poleB) => {
  if (scoreA > scoreB) return poleA;
  if (scoreB > scoreA) return poleB;
  // For ties, use 'X' notation to indicate uncertainty
  return 'X';
};

// Comprehensive MBTI type descriptions
export const getTypeDescription = (type, userName) => {
  // Handle 'X' notation in type
  const cleanType = type.replace(/X/g, '');
  const hasUncertainty = type.includes('X');
  
  const descriptions = {
    INTJ: {
      title: "The Architect",
      description: `${userName}, as an INTJ, you are a strategic and innovative thinker who excels at creating systems and solutions. Your analytical mind and drive for improvement make you a natural problem-solver. You value knowledge and competence, often pursuing mastery in your chosen fields. While you may appear reserved, your inner world is rich with ideas and possibilities.`,
      strengths: [
        "Strategic thinking and long-term planning",
        "Independent and self-motivated",
        "High standards and attention to detail",
        "Creative problem-solving abilities",
        "Natural leadership qualities"
      ],
      challenges: [
        "May be perceived as too direct or critical",
        "Can be perfectionistic",
        "May struggle with expressing emotions",
        "Sometimes impatient with inefficiency",
        "Can be overly independent"
      ]
    },
    INTP: {
      title: "The Logician",
      description: `${userName}, as an INTP, you are an innovative and analytical thinker who loves exploring complex theories and ideas. Your mind is constantly seeking to understand the underlying principles of the world around you. You excel at finding creative solutions to challenging problems and enjoy intellectual debates.`,
      strengths: [
        "Exceptional analytical abilities",
        "Creative and innovative thinking",
        "Objective and logical approach",
        "Natural problem-solving skills",
        "Open-minded and curious"
      ],
      challenges: [
        "May overthink decisions",
        "Can be perceived as aloof",
        "May struggle with routine tasks",
        "Sometimes procrastinates",
        "Can be overly critical"
      ]
    },
    ENTJ: {
      title: "The Commander",
      description: `${userName}, as an ENTJ, you are a natural-born leader with a strategic mind and a drive for achievement. You excel at organizing people and resources to achieve goals. Your confidence and decisiveness inspire others to follow your vision.`,
      strengths: [
        "Natural leadership abilities",
        "Strategic planning skills",
        "Confident and decisive",
        "Excellent organizational skills",
        "Goal-oriented and driven"
      ],
      challenges: [
        "May be perceived as too direct",
        "Can be impatient",
        "May struggle with emotional sensitivity",
        "Sometimes too focused on efficiency",
        "Can be overly competitive"
      ]
    },
    ENTP: {
      title: "The Debater",
      description: `${userName}, as an ENTP, you are an innovative and energetic thinker who loves intellectual challenges. You excel at seeing possibilities and generating new ideas. Your quick wit and ability to think on your feet make you an engaging conversationalist.`,
      strengths: [
        "Quick thinking and adaptability",
        "Creative problem-solving",
        "Excellent communication skills",
        "Natural curiosity",
        "Ability to see multiple perspectives"
      ],
      challenges: [
        "May struggle with follow-through",
        "Can be argumentative",
        "May get bored easily",
        "Sometimes too focused on possibilities",
        "Can be perceived as insensitive"
      ]
    },
    INFJ: {
      title: "The Advocate",
      description: `${userName}, as an INFJ, you are a compassionate and insightful individual who seeks to make a positive impact on the world. Your combination of creativity and analytical thinking allows you to see both the big picture and the details.`,
      strengths: [
        "Deep understanding of others",
        "Creative and insightful",
        "Strong moral compass",
        "Excellent communication skills",
        "Natural counseling abilities"
      ],
      challenges: [
        "May be too idealistic",
        "Can be overly sensitive",
        "May struggle with boundaries",
        "Sometimes too private",
        "Can be perfectionistic"
      ]
    },
    INFP: {
      title: "The Mediator",
      description: `${userName}, as an INFP, you are a creative and idealistic individual who values authenticity and personal growth. Your rich inner world and ability to understand others make you a natural empath.`,
      strengths: [
        "Creative and artistic",
        "Empathetic and understanding",
        "Authentic and genuine",
        "Open-minded and accepting",
        "Strong personal values"
      ],
      challenges: [
        "May be too idealistic",
        "Can be overly sensitive",
        "May struggle with practical matters",
        "Sometimes too self-critical",
        "Can be indecisive"
      ]
    },
    ENFJ: {
      title: "The Protagonist",
      description: `${userName}, as an ENFJ, you are a charismatic and inspiring leader who naturally brings out the best in others. Your combination of empathy and organization makes you excellent at motivating and guiding people.`,
      strengths: [
        "Natural leadership abilities",
        "Excellent communication skills",
        "Empathetic and understanding",
        "Organized and reliable",
        "Charismatic and inspiring"
      ],
      challenges: [
        "May be too idealistic",
        "Can be overly sensitive",
        "May struggle with criticism",
        "Sometimes too self-sacrificing",
        "Can be perfectionistic"
      ]
    },
    ENFP: {
      title: "The Campaigner",
      description: `${userName}, as an ENFP, you are an enthusiastic and creative individual who sees possibilities everywhere. Your energy and ability to connect with others make you a natural motivator and inspirer.`,
      strengths: [
        "Creative and innovative",
        "Excellent communication skills",
        "Adaptable and flexible",
        "Natural enthusiasm",
        "Ability to see possibilities"
      ],
      challenges: [
        "May struggle with follow-through",
        "Can be disorganized",
        "May get bored easily",
        "Sometimes too idealistic",
        "Can be overly emotional"
      ]
    },
    ISTJ: {
      title: "The Logistician",
      description: `${userName}, as an ISTJ, you are a practical and responsible individual who values order and tradition. Your attention to detail and reliability make you an excellent organizer and problem-solver.`,
      strengths: [
        "Reliable and responsible",
        "Excellent organizational skills",
        "Practical and realistic",
        "Detail-oriented",
        "Strong work ethic"
      ],
      challenges: [
        "May be too rigid",
        "Can be overly critical",
        "May struggle with change",
        "Sometimes too traditional",
        "Can be perceived as cold"
      ]
    },
    ISFJ: {
      title: "The Defender",
      description: `${userName}, as an ISFJ, you are a caring and dedicated individual who works quietly to protect and support others. Your combination of practicality and empathy makes you an excellent caretaker and helper.`,
      strengths: [
        "Reliable and responsible",
        "Caring and supportive",
        "Excellent memory",
        "Practical and realistic",
        "Strong work ethic"
      ],
      challenges: [
        "May be too self-sacrificing",
        "Can be overly sensitive",
        "May struggle with change",
        "Sometimes too traditional",
        "Can be perfectionistic"
      ]
    },
    ESTJ: {
      title: "The Executive",
      description: `${userName}, as an ESTJ, you are an efficient and organized individual who excels at managing people and resources. Your practical approach and strong work ethic make you a natural leader in traditional settings.`,
      strengths: [
        "Excellent organizational skills",
        "Natural leadership abilities",
        "Practical and realistic",
        "Reliable and responsible",
        "Strong work ethic"
      ],
      challenges: [
        "May be too rigid",
        "Can be overly critical",
        "May struggle with flexibility",
        "Sometimes too traditional",
        "Can be perceived as harsh"
      ]
    },
    ESFJ: {
      title: "The Consul",
      description: `${userName}, as an ESFJ, you are a caring and social individual who works to create harmony and support others. Your combination of practicality and empathy makes you an excellent organizer and caretaker.`,
      strengths: [
        "Excellent social skills",
        "Caring and supportive",
        "Organized and reliable",
        "Practical and realistic",
        "Natural caretaker"
      ],
      challenges: [
        "May be too traditional",
        "Can be overly sensitive",
        "May struggle with conflict",
        "Sometimes too self-sacrificing",
        "Can be perfectionistic"
      ]
    },
    ISTP: {
      title: "The Virtuoso",
      description: `${userName}, as an ISTP, you are a practical and analytical individual who excels at understanding how things work. Your combination of logic and hands-on approach makes you an excellent problem-solver.`,
      strengths: [
        "Excellent problem-solving skills",
        "Practical and realistic",
        "Independent and self-reliant",
        "Adaptable and flexible",
        "Natural mechanic/engineer"
      ],
      challenges: [
        "May be too private",
        "Can be perceived as cold",
        "May struggle with commitment",
        "Sometimes too independent",
        "Can be risk-taking"
      ]
    },
    ISFP: {
      title: "The Adventurer",
      description: `${userName}, as an ISFP, you are a creative and sensitive individual who lives in the present moment. Your combination of artistic ability and practicality makes you excellent at creating and experiencing beauty.`,
      strengths: [
        "Creative and artistic",
        "Sensitive and empathetic",
        "Practical and realistic",
        "Adaptable and flexible",
        "Natural aesthetic sense"
      ],
      challenges: [
        "May be too private",
        "Can be overly sensitive",
        "May struggle with planning",
        "Sometimes too independent",
        "Can be perfectionistic"
      ]
    },
    ESTP: {
      title: "The Entrepreneur",
      description: `${userName}, as an ESTP, you are an energetic and practical individual who lives in the moment. Your combination of logic and action makes you excellent at solving problems and taking risks.`,
      strengths: [
        "Excellent problem-solving skills",
        "Adaptable and flexible",
        "Practical and realistic",
        "Natural risk-taker",
        "Quick thinking"
      ],
      challenges: [
        "May be too impulsive",
        "Can be perceived as insensitive",
        "May struggle with planning",
        "Sometimes too risk-taking",
        "Can be easily bored"
      ]
    },
    ESFP: {
      title: "The Entertainer",
      description: `${userName}, as an ESFP, you are an enthusiastic and social individual who loves to experience life to the fullest. Your combination of practicality and spontaneity makes you excellent at creating fun and engaging experiences.`,
      strengths: [
        "Excellent social skills",
        "Enthusiastic and energetic",
        "Practical and realistic",
        "Adaptable and flexible",
        "Natural entertainer"
      ],
      challenges: [
        "May be too impulsive",
        "Can be disorganized",
        "May struggle with planning",
        "Sometimes too focused on fun",
        "Can be easily distracted"
      ]
    }
  };

  const description = descriptions[cleanType] || {
    title: "Your Unique Type",
    description: `${userName}, you have a unique personality type that combines various traits in a special way. Your individuality makes you who you are, and that's something to celebrate!`,
    strengths: ["Your unique combination of traits"],
    challenges: ["Areas where you can grow"]
  };

  // Add note about uncertainty if present
  if (hasUncertainty) {
    description.description += "\n\nNote: Some of your preferences were very close, indicating a balanced personality in those areas.";
  }

  return description;
}; 