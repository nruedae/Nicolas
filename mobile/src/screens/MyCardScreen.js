import React, { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, SafeAreaView, ActivityIndicator, Alert, Share,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { colors, spacing, radius, typography } from '../theme'
import { saveProfile } from '../utils/api'

const PROFILE_KEY = '@imprint_profile'

const ACCENT_OPTIONS = [
  colors.primary, '#10b981', '#f59e0b', '#f43f5e', '#06b6d4',
]

export default function MyCardScreen() {
  const [profile, setProfile] = useState({
    name: '', title: '', company: '', email: '',
    phone: '', linkedin: '', website: '', bio: '',
    color: colors.primary,
  })
  const [profileId, setProfileId] = useState(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load persisted profile on mount
  useEffect(() => {
    AsyncStorage.getItem(PROFILE_KEY)
      .then(json => {
        if (json) {
          const saved = JSON.parse(json)
          setProfile(saved.profile)
          setProfileId(saved.id)
        } else {
          setEditing(true)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    if (!profile.name || !profile.email) {
      return Alert.alert('Required', 'Name and email are required.')
    }
    setSaving(true)
    try {
      const payload = profileId ? { ...profile, id: profileId } : profile
      const { data } = await saveProfile(payload)
      setProfileId(data.profile.id)
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify({ id: data.profile.id, profile }))
      setEditing(false)
      Alert.alert('Saved!', 'Your card is ready to share.')
    } catch {
      Alert.alert('Error', 'Could not save your card. Check your connection.')
    } finally {
      setSaving(false)
    }
  }

  const handleShare = async () => {
    if (!profileId) return Alert.alert('Save first', 'Save your card before sharing.')
    const url = `http://localhost:5000/api/imprint/profile/${profileId}`
    await Share.share({ message: `Here's my Imprint card: ${url}`, url })
  }

  const Field = ({ label, field, placeholder, keyboardType, autoCapitalize = 'none' }) => (
    <View style={styles.field}>
      <Text style={typography.label}>{label}</Text>
      {editing ? (
        <TextInput
          style={styles.input}
          value={profile[field]}
          onChangeText={v => setProfile(p => ({ ...p, [field]: v }))}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
        />
      ) : (
        <Text style={[typography.body, !profile[field] && { color: colors.textMuted }]}>
          {profile[field] || '—'}
        </Text>
      )}
    </View>
  )

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Card Preview */}
        <View style={[styles.card, { borderTopColor: profile.color }]}>
          <View style={[styles.cardAvatar, { backgroundColor: profile.color }]}>
            <Text style={styles.cardAvatarText}>
              {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
          <Text style={styles.cardName}>{profile.name || 'Your Name'}</Text>
          <Text style={styles.cardTitle}>
            {profile.title || 'Your Title'}
            {profile.company ? ` · ${profile.company}` : ''}
          </Text>
          {profile.email ? (
            <Text style={styles.cardEmail}>{profile.email}</Text>
          ) : null}
        </View>

        {/* Accent color picker */}
        {editing && (
          <View style={styles.colorRow}>
            <Text style={[typography.label, { marginRight: spacing.md }]}>Card Color</Text>
            {ACCENT_OPTIONS.map(c => (
              <TouchableOpacity
                key={c}
                style={[styles.colorDot, { backgroundColor: c }, profile.color === c && styles.colorDotActive]}
                onPress={() => setProfile(p => ({ ...p, color: c }))}
              />
            ))}
          </View>
        )}

        {/* Fields */}
        <View style={styles.section}>
          <Field label="Full Name *" field="name" placeholder="Nicolas Smith" autoCapitalize="words" />
          <Field label="Job Title *" field="title" placeholder="Account Executive" autoCapitalize="words" />
          <Field label="Company" field="company" placeholder="Acme Corp" autoCapitalize="words" />
          <Field label="Email *" field="email" placeholder="you@company.com" keyboardType="email-address" />
          <Field label="Phone" field="phone" placeholder="+1 555 000 0000" keyboardType="phone-pad" />
          <Field label="LinkedIn URL" field="linkedin" placeholder="https://linkedin.com/in/..." />
          <Field label="Website" field="website" placeholder="https://yoursite.com" />
          <View style={styles.field}>
            <Text style={typography.label}>Bio</Text>
            {editing ? (
              <TextInput
                style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                value={profile.bio}
                onChangeText={v => setProfile(p => ({ ...p, bio: v }))}
                placeholder="One liner about yourself..."
                placeholderTextColor={colors.textMuted}
                multiline
                autoCapitalize="sentences"
              />
            ) : (
              <Text style={[typography.body, !profile.bio && { color: colors.textMuted }]}>
                {profile.bio || '—'}
              </Text>
            )}
          </View>
        </View>

        {/* Action buttons */}
        {editing ? (
          <TouchableOpacity
            style={[styles.primaryBtn, saving && styles.btnDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving
              ? <ActivityIndicator color={colors.white} />
              : <Text style={styles.btnText}>Save Card</Text>}
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={styles.primaryBtn} onPress={handleShare}>
              <Text style={styles.btnText}>Share My Card</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ghostBtn} onPress={() => setEditing(true)}>
              <Text style={styles.ghostBtnText}>Edit Card</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },

  card: {
    backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.lg, alignItems: 'center', marginBottom: spacing.lg,
    borderTopWidth: 4,
  },
  cardAvatar: {
    width: 72, height: 72, borderRadius: 36,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm,
  },
  cardAvatarText: { fontSize: 30, fontWeight: '700', color: colors.white },
  cardName: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  cardTitle: { fontSize: 14, color: colors.textMuted, marginBottom: spacing.xs },
  cardEmail: { fontSize: 13, color: colors.primary },

  colorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg, flexWrap: 'wrap', gap: spacing.sm },
  colorDot: { width: 28, height: 28, borderRadius: 14 },
  colorDotActive: { borderWidth: 3, borderColor: colors.white },

  section: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.lg },
  field: { marginBottom: spacing.md },
  input: {
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm,
    paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
    color: colors.text, fontSize: 15, marginTop: spacing.xs,
  },

  primaryBtn: {
    backgroundColor: colors.primary, borderRadius: radius.full,
    paddingVertical: spacing.md, alignItems: 'center', marginBottom: spacing.sm,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: colors.white, fontWeight: '700', fontSize: 16 },
  ghostBtn: { paddingVertical: spacing.sm, alignItems: 'center' },
  ghostBtnText: { color: colors.textMuted, fontSize: 15 },
})
