import {
  ArrowBigDownDash,
  BadgeInfo,
  Cloud,
  CloudDrizzle,
  CloudSun,
  Ellipsis,
  ExternalLink,
  File,
  Globe,
  Link,
  Mail,
  MapPin,
  Menu,
  MoonStar,
  QrCode,
  Send,
  Snowflake,
  SquareTerminal,
  Sun,
  Thermometer,
  ToggleLeft,
} from "lucide-react"

type IconsMap = {
  [key: string]: React.FC<React.SVGProps<SVGSVGElement>>
}

const InstagramSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)

const LinkedInSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 490.732 490.732"
    xmlSpace="preserve"
    width={24}
    height={24}
    className="rounded-sm"
  >
    <g>
      <g>
        <path
          fill="currentColor"
          d="M472.366,0.003H18.36C8.219,0.003,0,8.222,0,18.363v454.005c0,10.143,8.219,18.361,18.36,18.361h454.012    c10.142,0,18.36-8.219,18.36-18.361V18.363C490.727,8.222,482.507,0.003,472.366,0.003z M130.375,403.808    c0,6.762-5.478,12.238-12.24,12.238H69.132c-6.756,0-12.24-5.477-12.24-12.238V189.625c0-6.763,5.484-12.24,12.24-12.24h49.003    c6.762,0,12.24,5.477,12.24,12.24V403.808z M130.375,127.482c0,6.763-5.478,12.24-12.24,12.24H69.132    c-6.756,0-12.24-5.478-12.24-12.24V83.969c0-6.763,5.484-12.24,12.24-12.24h49.003c6.762,0,12.24,5.477,12.24,12.24V127.482z     M433.835,403.808c0,6.762-5.483,12.238-12.24,12.238h-49.003c-6.763,0-12.24-5.477-12.24-12.238v-90.436    c0-29.988-1.566-49.383-4.712-58.189c-3.14-8.807-8.237-15.649-15.3-20.526c-7.062-4.884-15.558-7.32-25.496-7.32    c-12.729,0-24.149,3.488-34.26,10.459c-10.11,6.977-17.038,16.211-20.79,27.717c-3.745,11.506-5.618,32.779-5.618,63.807v74.488    c0,6.762-5.483,12.238-12.24,12.238h-49.003c-6.756,0-12.24-5.477-12.24-12.238V189.625c0-6.763,5.483-12.24,12.24-12.24h43.771    c6.763,0,12.24,5.477,12.24,12.24v16.316c0,6.763,3.312,7.852,7.858,2.852c22.864-25.123,50.753-37.687,83.673-37.687    c16.212,0,31.028,2.919,44.455,8.758c13.422,5.838,23.58,13.292,30.466,22.356c6.885,9.063,11.683,19.351,14.382,30.857    c2.699,11.505,4.058,27.98,4.058,49.426V403.808L433.835,403.808z"
        />
      </g>
    </g>
  </svg>
)

const icons: IconsMap = {
  arrowBigDownDash: ArrowBigDownDash,
  badgeInfo: BadgeInfo,
  cloud: Cloud,
  cloudDrizzle: CloudDrizzle,
  cloudSun: CloudSun,
  ellipsis: Ellipsis,
  externalLink: ExternalLink,
  github: SquareTerminal,
  globe: Globe,
  instagram: InstagramSVG,
  link: Link,
  linkedIn: LinkedInSVG,
  mail: Mail,
  mapPin: MapPin,
  menu: Menu,
  moon: MoonStar,
  qrCode: QrCode,
  readCV: File,
  send: Send,
  snowflake: Snowflake,
  sun: Sun,
  toggleLeft: ToggleLeft,
}

export default icons
