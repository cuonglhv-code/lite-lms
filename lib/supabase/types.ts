export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      activities: {
        Row: {
          id: string
          course_id: string
          module_id: string | null
          title: string
          type: 'ielts_task1' | 'ielts_task2'
          config_json: Json
          created_by: string
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          course_id: string
          module_id?: string | null
          title: string
          type: 'ielts_task1' | 'ielts_task2'
          config_json?: Json
          created_by: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          course_id?: string
          module_id?: string | null
          title?: string
          type?: 'ielts_task1' | 'ielts_task2'
          config_json?: Json
          created_by?: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Relationships: []
      }
      activity_submissions: {
        Row: {
          id: string
          activity_id: string
          student_id: string
          status: 'pending' | 'scoring' | 'scored' | 'error'
          essay_text: string | null
          examiner_payload_json: Json | null
          examiner_result_json: Json | null
          band_overall: number | null
          submitted_at: string
          scored_at: string | null
          deleted_at: string | null
        }
        Insert: {
          id?: string
          activity_id: string
          student_id: string
          status?: 'pending' | 'scoring' | 'scored' | 'error'
          essay_text?: string | null
          examiner_payload_json?: Json | null
          examiner_result_json?: Json | null
          band_overall?: number | null
          submitted_at?: string
          scored_at?: string | null
          deleted_at?: string | null
        }
        Update: {
          id?: string
          activity_id?: string
          student_id?: string
          status?: 'pending' | 'scoring' | 'scored' | 'error'
          essay_text?: string | null
          examiner_payload_json?: Json | null
          examiner_result_json?: Json | null
          band_overall?: number | null
          submitted_at?: string
          scored_at?: string | null
          deleted_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
