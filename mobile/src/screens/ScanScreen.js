import React, { useState, useRef } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator,
  Alert, ScrollView, SafeAreaView,
} from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { colors, spacing, radius, typography } from '../theme'
import { scanCard, saveContact } from '../utils/api'

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions()
  const [mode, setMode] = useState('camera') // 'camera' | 'loading' | 'result'
  const [result, setResult] = useState(null)
  const [saving, setSaving] = useState(false)
  const [event, setEvent] = useState('')
  const cameraRef = useRef(null)

  // ── Capture & scan ────────────────────────────────────────────────────────
  const handleCapture = async () => {
    if (!cameraRef.current) return
    try {
      setMode('loading')
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.7,
        exif: false,
      })
      const { data } = await scanCard(photo.base64)
      setResult(data.card)
      setMode('result')
    } catch (err) {
      setMode('camera')
      Alert.alert('Scan failed', err.response?.data?.error || err.message)
    }
  }

  // ── Save contact ──────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!result) return
    setSaving(true)
    try {
      await saveContact({ ...result, event: event || undefined })
      Alert.alert('Saved!', `${result.name} added to your contacts.`)
      setResult(null)
      setMode('camera')
    } catch {
      Alert.alert('Error', 'Could not save contact.')
    } finally {
      setSaving(false)
    }
  }

  // ── Permission gate ───────────────────────────────────────────────────────
  if (!permission) return <View style={styles.container} />

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={[typography.body, { textAlign: 'center', marginBottom: spacing.md }]}>
          Camera access is needed to scan business cards.
        </Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={requestPermission}>
          <Text style={styles.btnText}>Grant Camera Access</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (mode === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[typography.body, { marginTop: spacing.md }]}>
          Analyzing card with AI...
        </Text>
        <Text style={[typography.caption, { marginTop: spacing.sm }]}>
          Extracting details &amp; generating snapshot
        </Text>
      </View>
    )
  }

  // ── Result card ───────────────────────────────────────────────────────────
  if (mode === 'result' && result) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.resultContainer}>
          {/* Header */}
          <View style={styles.resultHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(result.name || '?').charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.name}>{result.name || '—'}</Text>
            <Text style={[typography.body, { color: colors.textMuted }]}>
              {result.title}{result.company ? ` · ${result.company}` : ''}
            </Text>
          </View>

          {/* AI Summary */}
          {result.summary && (
            <View style={styles.summaryBox}>
              <Text style={typography.label}>AI Snapshot</Text>
              <Text style={[typography.body, { marginTop: spacing.sm, lineHeight: 22 }]}>
                {result.summary}
              </Text>
            </View>
          )}

          {/* Contact details */}
          <View style={styles.detailsBox}>
            <Text style={typography.label}>Contact Details</Text>
            {[
              ['Email', result.email],
              ['Phone', result.phone],
              ['LinkedIn', result.linkedin],
              ['Website', result.website],
            ]
              .filter(([, v]) => v)
              .map(([label, value]) => (
                <View key={label} style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{label}</Text>
                  <Text style={styles.detailValue} numberOfLines={1}>{value}</Text>
                </View>
              ))}
          </View>

          {/* Tags */}
          {result.tags?.length > 0 && (
            <View style={styles.tagsRow}>
              {result.tags.map(tag => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Actions */}
          <TouchableOpacity
            style={[styles.primaryBtn, saving && styles.btnDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving
              ? <ActivityIndicator color={colors.white} />
              : <Text style={styles.btnText}>Save to Contacts</Text>}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ghostBtn}
            onPress={() => { setResult(null); setMode('camera') }}
          >
            <Text style={styles.ghostBtnText}>Scan Another</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    )
  }

  // ── Camera ────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back">
        {/* Overlay guide */}
        <View style={styles.overlay}>
          <Text style={styles.overlayTitle}>Point at a business card</Text>
          <View style={styles.cardFrame} />
          <Text style={styles.overlayHint}>Hold steady — AI will extract details</Text>
        </View>

        {/* Capture button */}
        <View style={styles.captureRow}>
          <TouchableOpacity style={styles.captureBtn} onPress={handleCapture}>
            <View style={styles.captureInner} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  camera: { flex: 1 },

  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  overlayTitle: { color: colors.white, fontSize: 16, fontWeight: '600', marginBottom: spacing.lg },
  cardFrame: {
    width: '100%', height: 180,
    borderWidth: 2, borderColor: colors.primary, borderRadius: radius.md,
    backgroundColor: 'rgba(99,102,241,0.05)',
  },
  overlayHint: { color: colors.textMuted, fontSize: 13, marginTop: spacing.md },

  captureRow: { alignItems: 'center', paddingBottom: spacing.xl },
  captureBtn: {
    width: 72, height: 72, borderRadius: 36,
    borderWidth: 3, borderColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
  },
  captureInner: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.white },

  resultContainer: { padding: spacing.lg, paddingBottom: spacing.xxl },
  resultHeader: { alignItems: 'center', marginBottom: spacing.lg },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarText: { fontSize: 32, fontWeight: '700', color: colors.white },
  name: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },

  summaryBox: {
    backgroundColor: colors.surface, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.md,
    borderLeftWidth: 3, borderLeftColor: colors.primary,
  },

  detailsBox: {
    backgroundColor: colors.surface, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.md,
  },
  detailRow: { flexDirection: 'row', marginTop: spacing.sm },
  detailLabel: { width: 70, fontSize: 13, color: colors.textMuted, fontWeight: '600' },
  detailValue: { flex: 1, fontSize: 13, color: colors.text },

  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.lg },
  tag: { backgroundColor: colors.surfaceLight, borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  tagText: { fontSize: 12, color: colors.accent },

  primaryBtn: {
    backgroundColor: colors.primary, borderRadius: radius.full,
    paddingVertical: spacing.md, alignItems: 'center', marginBottom: spacing.sm,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: colors.white, fontWeight: '700', fontSize: 16 },

  ghostBtn: { paddingVertical: spacing.sm, alignItems: 'center' },
  ghostBtnText: { color: colors.textMuted, fontSize: 15 },
})
