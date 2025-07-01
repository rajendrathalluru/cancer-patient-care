-- Insert sample user
INSERT INTO users (
  id,
  email,
  password_hash,
  name,
  phone,
  emergency_contact,
  allergies,
  medical_history,
  diagnosis,
  treatment_type,
  treatment_completed,
  treatment_total
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'sarah.williams@example.com',
  '$2b$10$rQZ8kHp0rQZ8kHp0rQZ8kOp0rQZ8kHp0rQZ8kHp0rQZ8kHp0rQZ8k',
  'Sarah Williams',
  '555-123-4567',
  'John Williams - 555-987-6543',
  'Penicillin',
  'Breast cancer diagnosis in 2024, no prior major medical conditions',
  'Breast Cancer, Stage 2, ER+/PR+, HER2-',
  'Chemotherapy',
  13,
  20
) ON CONFLICT (email) DO NOTHING;

-- Insert sample medications
INSERT INTO medications (user_id, name, dosage, frequency, time, status) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Tamoxifen', '20mg', 'Once daily', '08:00', 'taken'),
('550e8400-e29b-41d4-a716-446655440000', 'Ondansetron', '8mg', 'As needed for nausea', '12:00', 'pending'),
('550e8400-e29b-41d4-a716-446655440000', 'Dexamethasone', '4mg', 'Twice daily', '20:00', 'pending'),
('550e8400-e29b-41d4-a716-446655440000', 'Vitamin D', '1000 IU', 'Once daily', '08:00', 'missed')
ON CONFLICT DO NOTHING;

-- Insert sample symptoms
INSERT INTO symptoms (user_id, name, severity, notes, timestamp) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Fatigue', 'moderate', 'Felt tired after short walk, needed to rest for 1 hour', NOW() - INTERVAL '2 hours'),
('550e8400-e29b-41d4-a716-446655440000', 'Nausea', 'mild', 'Slight nausea after breakfast, subsided with medication', NOW() - INTERVAL '5 hours'),
('550e8400-e29b-41d4-a716-446655440000', 'Pain', 'mild', 'Slight joint pain in the morning, improved throughout the day', NOW() - INTERVAL '6 hours')
ON CONFLICT DO NOTHING;

-- Insert sample appointments
INSERT INTO appointments (user_id, doctor_name, type, date, is_virtual, location) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Dr. Johnson', 'Follow-up Consultation', NOW() + INTERVAL '3 days', FALSE, 'Memorial Cancer Center'),
('550e8400-e29b-41d4-a716-446655440000', 'Dr. Martinez', 'Nutrition Consultation', NOW() + INTERVAL '7 days', TRUE, NULL),
('550e8400-e29b-41d4-a716-446655440000', 'Infusion Center', 'Chemotherapy Session 14', NOW() + INTERVAL '10 days', FALSE, 'Memorial Cancer Center - Infusion Unit'),
('550e8400-e29b-41d4-a716-446655440000', 'Dr. Smith', 'Blood Work', NOW() + INTERVAL '14 days', FALSE, 'Memorial Cancer Center - Lab'),
('550e8400-e29b-41d4-a716-446655440000', 'Dr. Wilson', 'Therapy Session', NOW() + INTERVAL '21 days', TRUE, NULL),
('550e8400-e29b-41d4-a716-446655440000', 'Radiology', 'CT Scan', NOW() + INTERVAL '28 days', FALSE, 'Memorial Cancer Center - Radiology')
ON CONFLICT DO NOTHING;

-- Insert sample journal entries
INSERT INTO journal_entries (user_id, title, content, timestamp) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Today I felt stronger', 'Was able to go for a short walk in the park. The fresh air felt amazing and I didn''t feel as tired as usual. The new medication seems to be helping with the side effects.', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440000', 'Post-treatment reflections', 'The side effects were milder this time. Tried the new anti-nausea medication and it worked much better than the previous one. Feeling hopeful about the progress.', NOW() - INTERVAL '3 days')
ON CONFLICT DO NOTHING;

-- Insert sample care team
INSERT INTO care_team (user_id, name, role, contact) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Dr. Johnson', 'Medical Oncologist', '555-123-4567'),
('550e8400-e29b-41d4-a716-446655440000', 'Dr. Smith', 'Surgical Oncologist', '555-234-5678'),
('550e8400-e29b-41d4-a716-446655440000', 'Dr. Martinez', 'Radiation Oncologist', '555-345-6789'),
('550e8400-e29b-41d4-a716-446655440000', 'Sarah Wilson', 'Oncology Nurse Navigator', '555-456-7890')
ON CONFLICT DO NOTHING;

-- Insert notification settings
INSERT INTO notification_settings (user_id) VALUES
('550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT DO NOTHING;
