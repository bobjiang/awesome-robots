/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

import SpecificationTable from '@/components/SpecificationTable'
import type { Robot } from '@/types/robot'

// Default fallback robot (uses the generic spec table)
const defaultRobot: Robot = {
  id: 'test-generic',
  name: 'Generic Bot',
  brand: 'TestBrand',
  category: 'humanoid',
  price: { starting: 5000, currency: 'USD', models: [] },
  specifications: {
    dimensions: '1.2m x 0.5m x 0.3m',
    weight: '15 kg',
    battery: '2 hours',
    maxSpeed: '5 km/h',
    dof: 23,
    sensors: ['LiDAR', 'Camera', 'IMU'],
  },
  features: [],
  images: [],
  officialUrl: null,
  description: 'A generic test robot',
}

// Go2 robot (uses the 4-column variant spec table)
const go2Robot: Robot = {
  id: 'unitree-go2',
  name: 'Go2',
  brand: 'Unitree',
  category: 'quadruped',
  price: { starting: 1600, currency: 'USD', models: [] },
  specifications: {
    dimensions: '700x310x400mm (standing), 700x310x200mm (crouching)',
    weight: '15 kg',
    material: 'Alloy',
    voltage: '28.8V',
    workingMaxPower: '350W',
    payload: { AIR: '3 kg', PRO: '5 kg', EDU: '8 kg' },
    maxSpeed: { AIR: '3.5 m/s', PRO: '3.5 m/s', EDU: '3.5 m/s' },
    maxClimbHeight: { AIR: '50mm', PRO: '50mm', EDU: '50mm' },
    maxClimbAngle: { AIR: '30 deg', PRO: '30 deg', EDU: '30 deg' },
    computingPower: { AIR: '8 TOPS', PRO: '8 TOPS', EDU: '100 TOPS' },
    wirelessVectorPositioning: { AIR: 'No', PRO: 'No', EDU: 'Yes' },
    footEndForceSensor: { AIR: 'No', PRO: 'Yes', EDU: 'Yes' },
    battery: { AIR: '8000mAh', PRO: '8000mAh', EDU: '8000mAh' },
    sensors: ['3D LiDAR', '4D Radar', 'Camera'],
  },
  features: [],
  images: [],
  officialUrl: null,
  description: 'Unitree Go2 quadruped robot',
}

describe('A11Y-005: SpecificationTable uses semantic table elements', () => {
  afterEach(() => {
    cleanup()
  })

  describe('Default specification table', () => {
    it('renders with <table> element', () => {
      const { container } = render(<SpecificationTable robot={defaultRobot} />)
      const table = container.querySelector('table')
      expect(table).toBeInTheDocument()
    })

    it('uses <th> elements for spec labels', () => {
      const { container } = render(<SpecificationTable robot={defaultRobot} />)
      const thElements = container.querySelectorAll('th')
      expect(thElements.length).toBeGreaterThan(0)
    })

    it('uses <td> elements for spec values', () => {
      const { container } = render(<SpecificationTable robot={defaultRobot} />)
      const tdElements = container.querySelectorAll('td')
      expect(tdElements.length).toBeGreaterThan(0)
    })

    it('uses <tr> elements for rows', () => {
      const { container } = render(<SpecificationTable robot={defaultRobot} />)
      const trElements = container.querySelectorAll('tr')
      expect(trElements.length).toBeGreaterThan(0)
    })
  })

  describe('Go2 variant specification table', () => {
    it('renders with <table> element', () => {
      const { container } = render(<SpecificationTable robot={go2Robot} />)
      const table = container.querySelector('table')
      expect(table).toBeInTheDocument()
    })

    it('has <thead> for column headers', () => {
      const { container } = render(<SpecificationTable robot={go2Robot} />)
      const thead = container.querySelector('thead')
      expect(thead).toBeInTheDocument()
    })

    it('has <tbody> for data rows', () => {
      const { container } = render(<SpecificationTable robot={go2Robot} />)
      const tbody = container.querySelector('tbody')
      expect(tbody).toBeInTheDocument()
    })

    it('column headers use <th> with scope="col"', () => {
      const { container } = render(<SpecificationTable robot={go2Robot} />)
      const thead = container.querySelector('thead')
      const colHeaders = thead?.querySelectorAll('th[scope="col"]')
      expect(colHeaders).toBeDefined()
      expect(colHeaders!.length).toBeGreaterThan(0)
    })

    it('row headers use <th> with scope="row"', () => {
      const { container } = render(<SpecificationTable robot={go2Robot} />)
      const tbody = container.querySelector('tbody')
      const rowHeaders = tbody?.querySelectorAll('th[scope="row"]')
      expect(rowHeaders).toBeDefined()
      expect(rowHeaders!.length).toBeGreaterThan(0)
    })
  })
})
