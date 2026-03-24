export type ExaminerPayload = {
  essay: string
  taskNumber: '1' | '2'
  taskType: 'academic' | 'general'
  question: string
  user_id?: string
  language?: 'en' | 'vi'
}

export type CriterionFeedback = {
  score: number
  wellDone: string
  improvement: string
}

export type ExaminerResult = {
  success: boolean
  result: {
    bands: { 
      ta: number; 
      cc: number; 
      lr: number; 
      gra: number; 
      overall: number 
    }
    feedback: { 
      ta: CriterionFeedback; 
      cc: CriterionFeedback; 
      lr: CriterionFeedback; 
      gra: CriterionFeedback 
    }
    tips: string[]
    wordCount: number
    overallComment: string
  }
}
