// Single source of truth. Only facts from Digi's CV. No phone number by design.
export const P = {
  name: ['Digi', 'Shrestha'], headline: 'Computer Networking & IT Security student',
  intro: 'I study how networks move traffic and how they get attacked. Right now that means Cisco Packet Tracer labs, Linux, small apps, an IoT robot, and an internship in a college NOC.',
  email: 'digishrestha687@gmail.com', github: 'Digi-dotcom', linkedin: 'https://www.linkedin.com/in/digi-shrestha-289987344', location: 'Kathmandu, Nepal',
  cv: { href: `${import.meta.env?.BASE_URL ?? '/'}Digi_Shrestha_CV.pdf`, file: 'Digi_Shrestha_CV.pdf' },
  facts: [['Studying', 'BSc (Hons) Computer Networking & IT Security'], ['University', 'London Metropolitan University, at Islington College'], ['Working', 'IT Intern, IT and NOC department (since Apr 2026)'], ['Focus', 'Networking, cybersecurity, system administration'], ['Based in', 'Kathmandu, Nepal']],
  skills: [
    ['Networking', ['Cisco Packet Tracer', 'Cisco Networking Academy'], ['Network defence']],
    ['Security', ['Cybersecurity fundamentals (Fortinet)'], ['Ethical hacking basics']],
    ['Systems', ['Linux'], ['AWS CloudFormation']],
    ['Programming', ['C', 'Java', 'JavaScript', 'Python'], []],
    ['Tools', ['VS Code', 'JDK', 'Git and GitHub'], []]],
  experience: [['IT Intern', 'Islington College, IT and NOC department', 'Apr 2026 to present']],
  education: [['BSc (Hons) Computer Networking & IT Security', 'Islington College, London Metropolitan University', 'Jan 2026 to present'], ['SEE', 'New West Point Higher Secondary Boarding School', '']],
  certs: [['Network Defence', 'Cisco Networking Academy', '2026-08-04'], ['AWS CloudFormation', 'Amazon Web Services', '2026-03-27'], ['Cybersecurity Fundamentals', 'Fortinet', '2026-01-10'], ['OOPs Fundamentals', 'LinkedIn Learning', '2025-06-16']],
  projects: [
    { title: 'IoT Obstacle-Avoiding Robot', cat: 'IoT', when: 'Feb to Jun 2026', status: 'Completed', role: 'Team leader', about: 'A robot that uses ultrasonic sensors to detect objects and DC motors to steer around them. I led the team through the build.', tech: ['Ultrasonic sensor', 'DC motors'], repo: '' },
    { title: 'WatchMe.com', cat: 'Web', when: 'Jan 2026', status: 'Completed', about: 'An e-commerce site that works as a one-stop shop for luxury watches.', tech: ['Web'], repo: 'https://github.com/Digidotcom/WatchMe/blob/main/All%20codes.zip' },
    { title: 'Gym Membership', cat: 'Software', when: 'Jan 2026', status: 'Completed', about: 'An application that records regular and premium gym members.', tech: ['Python'], repo: 'https://github.com/Digi-dotcom/Python-Application/blob/main/Gym%20MemberShip%20Codes.zip' },
    { title: 'Python General Store', cat: 'Software', when: 'Jan 2026', status: 'Completed', about: 'A small store application written in Python.', tech: ['Python'], repo: 'https://github.com/Digi-dotcom/Python-Application/blob/main/Python.zip' }],
  // ILLUSTRATIVE design, not a real homelab.
  topo: {
    nodes: [
      { id: 'wan', l: 'Internet', kind: 'Edge', x: 70, y: 150, role: 'Untrusted upstream network.', vlan: '-', svc: [] },
      { id: 'fw', l: 'Firewall', kind: 'Security', x: 215, y: 150, role: 'Default-deny between zones. NAT to the internet.', vlan: 'all', svc: ['Stateful filtering', 'NAT'], rules: ['allow clients  > internet  tcp/53,80,443', 'allow clients  > servers   tcp/443', 'deny  iot      > servers', 'deny  any      > management'] },
      { id: 'sw', l: 'Switch', kind: 'Network', x: 360, y: 150, role: 'Layer 2 switching with 802.1Q trunk ports.', vlan: 'trunk', svc: ['VLAN trunking'] },
      { id: 'v10', l: 'VLAN 10', kind: 'VLAN', x: 530, y: 50, role: 'Management. Admin access only.', vlan: '10', svc: [] },
      { id: 'v20', l: 'VLAN 20', kind: 'VLAN', x: 530, y: 150, role: 'Servers: Linux host, DNS and DHCP.', vlan: '20', svc: ['DNS', 'DHCP'] },
      { id: 'v30', l: 'VLAN 30', kind: 'VLAN', x: 530, y: 250, role: 'Client devices.', vlan: '30', svc: [] }],
    links: [['wan', 'fw'], ['fw', 'sw'], ['sw', 'v10'], ['sw', 'v20'], ['sw', 'v30']] }
};
