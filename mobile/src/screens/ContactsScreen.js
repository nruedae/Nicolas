import React, { useState, useCallback } from 'react'
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  SafeAreaView, ActivityIndicator, TextInput, Alert, Modal,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { colors, spacing, radius, typography } from '../theme'
import { getContacts } from '../utils/api'

export default function ContactsScreen() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  // Reload contacts each time the tab is focused
  useFocusEffect(
    useCallback(() => {
      let active = true
      setLoading(true)
      getContacts()
        .then(({ data }) => { if (active) setContacts(data.contacts) })
        .catch(() => Alert.alert('Error', 'Could not load contacts'))
        .finally(() => { if (active) setLoading(false) })
      return () => { active = false }
    }, []),
  )

  const filtered = contacts.filter(c =>
    [c.name, c.company, c.title, c.event]
      .filter(Boolean)
      .some(v => v.toLowerCase().includes(search.toLowerCase())),
  )

  const renderContact = ({ item }) => (
    <TouchableOpacity style={styles.contactRow} onPress={() => setSelected(item)}>
      <View style={[styles.avatar, { backgroundColor: item.color || colors.primary }]}>
        <Text style={styles.avatarText}>{(item.name || '?').charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactSub} numberOfLines={1}>
          {[item.title, item.company].filter(Boolean).join(' · ')}
        </Text>
        {item.event && (
          <View style={styles.eventBadge}>
            <Text style={styles.eventText}>{item.event}</Text>
          </View>
        )}
      </View>
      <Text style={styles.contactDate}>
        {new Date(item.savedAt).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      {/* Search */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search contacts..."
          placeholderTextColor={colors.textMuted}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Stats bar */}
      <View style={styles.statsBar}>
        <Text style={typography.caption}>
          {filtered.length} contact{filtered.length !== 1 ? 's' : ''}
          {search ? ` matching "${search}"` : ''}
        </Text>
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.center}>
          <Text style={typography.body}>{search ? 'No matches' : 'No contacts yet'}</Text>
          <Text style={[typography.caption, { marginTop: spacing.sm, textAlign: 'center' }]}>
            {!search && 'Scan a business card\nto save your first contact'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={renderContact}
          contentContainerStyle={{ paddingBottom: spacing.xxl }}
        />
      )}

      {/* Detail modal */}
      <Modal
        visible={!!selected}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelected(null)}
      >
        {selected && <ContactDetail contact={selected} onClose={() => setSelected(null)} />}
      </Modal>
    </SafeAreaView>
  )
}

function ContactDetail({ contact, onClose }) {
  return (
    <SafeAreaView style={detailStyles.container}>
      {/* Close */}
      <TouchableOpacity style={detailStyles.closeBtn} onPress={onClose}>
        <Text style={detailStyles.closeText}>Done</Text>
      </TouchableOpacity>

      {/* Header */}
      <View style={detailStyles.header}>
        <View style={[detailStyles.avatar, { backgroundColor: contact.color || colors.primary }]}>
          <Text style={detailStyles.avatarText}>{contact.name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={detailStyles.name}>{contact.name}</Text>
        <Text style={detailStyles.sub}>
          {[contact.title, contact.company].filter(Boolean).join(' · ')}
        </Text>
      </View>

      {/* AI Summary */}
      {contact.summary && (
        <View style={detailStyles.summaryBox}>
          <Text style={typography.label}>AI Snapshot</Text>
          <Text style={[typography.body, { marginTop: spacing.sm, lineHeight: 22 }]}>
            {contact.summary}
          </Text>
        </View>
      )}

      {/* Details */}
      <View style={detailStyles.detailsBox}>
        {[
          ['Email', contact.email],
          ['Phone', contact.phone],
          ['LinkedIn', contact.linkedin],
          ['Website', contact.website],
          ['Event', contact.event],
          ['Notes', contact.notes],
        ]
          .filter(([, v]) => v)
          .map(([label, value]) => (
            <View key={label} style={detailStyles.row}>
              <Text style={detailStyles.rowLabel}>{label}</Text>
              <Text style={detailStyles.rowValue}>{value}</Text>
            </View>
          ))}
      </View>

      {/* Tags */}
      {contact.tags?.length > 0 && (
        <View style={detailStyles.tagsRow}>
          {contact.tags.map(t => (
            <View key={t} style={detailStyles.tag}>
              <Text style={detailStyles.tagText}>{t}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={[typography.caption, { textAlign: 'center', marginTop: spacing.lg }]}>
        Saved {new Date(contact.savedAt).toLocaleString()}
      </Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },

  searchRow: { padding: spacing.md, paddingBottom: spacing.sm },
  searchInput: {
    backgroundColor: colors.surface, borderRadius: radius.full,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    color: colors.text, fontSize: 15,
  },

  statsBar: { paddingHorizontal: spacing.md, paddingBottom: spacing.sm },

  contactRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  avatarText: { fontSize: 18, fontWeight: '700', color: colors.white },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 15, fontWeight: '600', color: colors.text },
  contactSub: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  eventBadge: {
    alignSelf: 'flex-start', marginTop: spacing.xs,
    backgroundColor: colors.surfaceLight, borderRadius: radius.full,
    paddingHorizontal: spacing.sm, paddingVertical: 2,
  },
  eventText: { fontSize: 11, color: colors.accent },
  contactDate: { fontSize: 12, color: colors.textMuted },
})

const detailStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  closeBtn: { alignSelf: 'flex-end', padding: spacing.md },
  closeText: { color: colors.primary, fontSize: 16, fontWeight: '600' },

  header: { alignItems: 'center', paddingVertical: spacing.lg },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm,
  },
  avatarText: { fontSize: 34, fontWeight: '700', color: colors.white },
  name: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  sub: { fontSize: 14, color: colors.textMuted },

  summaryBox: {
    marginHorizontal: spacing.lg, marginBottom: spacing.md,
    backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md,
    borderLeftWidth: 3, borderLeftColor: colors.primary,
  },

  detailsBox: {
    marginHorizontal: spacing.lg, marginBottom: spacing.md,
    backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md,
  },
  row: { flexDirection: 'row', marginTop: spacing.sm },
  rowLabel: { width: 70, fontSize: 13, color: colors.textMuted, fontWeight: '600' },
  rowValue: { flex: 1, fontSize: 13, color: colors.text },

  tagsRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs,
    marginHorizontal: spacing.lg, marginBottom: spacing.md,
  },
  tag: { backgroundColor: colors.surfaceLight, borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  tagText: { fontSize: 12, color: colors.accent },
})
