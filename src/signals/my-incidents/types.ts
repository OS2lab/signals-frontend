// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 - 2023 Gemeente Amsterdam
import type { Item } from 'shared/types/extraProperties'
import type Location from 'types/location'
export interface MyIncidentsValue {
  email?: string
  setEmail: (email: string) => void
  incidentsList?: MyIncident[]
  setIncidentsList: (incidentsList: MyIncident[]) => void
}

interface Attachment {
  created_at: string
  created_by: string
  href: string
  caption?: string
}

export interface MyIncident {
  _links: Links
  _display: string
  uuid: string
  id_display: string
  text: string
  status: {
    state: string
    state_display: string
  }
  created_at: string
}

interface Links {
  curies: {
    name: string
    href: string
  }
  self: {
    href: string
  }
}

export interface MyIncidentDetail extends MyIncident {
  _links: Links & { 'sia:attachments': Attachment[] }
  location: Location
  extra_properties?: Item[]
}

export interface Result<T> {
  count: number
  results: T[]
}

export interface HistoryInstance {
  when: string
  what: string
  action: string
  description: string
  _signal: string
}

export interface Email {
  email: string
}
