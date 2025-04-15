import { CSSProperties, ReactNode } from "react"

export interface PageProps {
  showTitle?: boolean
  ctrlEnter?: Function
  grantEvent?: grantEventList | any
  customEvent?: customEventProps[]
  searchBox?: ReactNode
  searchFormConfig?: searchFormConfigProps
  children?: ReactNode
  grantBtnCtrl?: any
}

export interface customEventProps {
  label: string
  disabled?: boolean
  hidden?: boolean
  onClick: (e: any) => void
}

export interface searchFormConfigProps {
  labelCol?: number
  style?: CSSProperties
}

export interface MultiComboComponent {
  initCheckYn?: boolean
  key: string
  label: ReactNode
  node: ReactNode
}

export interface checkOptionProps {
  label: ReactNode
  value: string
}

export interface Popup {
  /** 팝업 오픈 시, 엔터키 동작에 관한 이벤트 할당 */
  ctrlEnter?: Function
  /** 팝업 공통 이벤트 */
  popGrantEvent?: popGrantEventList
  /** 팝업 커스텀 이벤트 */
  popCustomEvent?: any
  /** 팝업 검색 박스  */
  searchBox?: ReactNode
  /** 최상단 Node (검색박스와 컨텐츠 사이) */
  extraTopNode?: ReactNode
  /** 검색창 열고 닫기 버튼 */
  collapsible?: boolean
  /** 팝업 컬러 테마 (미적용) */
  theme?: "blue" | "green" | "yellow" | "red"
  /** 팝업 컨텐츠 */
  children?: ReactNode
  /** 팝업코드 (Hooks 으로 처리하기 위한 고유 팝업 코드) */
  popuCd: string
  /** 팝업 닫기 옵션 */
  closeOpt?: {
    /** Confirm창 오픈 여부 */
    isConfirm?: boolean
    /** Confirm창 Custom 제목 (isConfirm: true 시 작동) */
    title?: string | ReactNode
    /** Confirm창 Custom 내용 (isConfirm: true 시 작동)*/
    content?: string | ReactNode
  }
  /** 팝업 관련 도움말 버튼 */
  help?: {
    title: string | ReactNode
  }
}

export interface CodeItem {
  value: string
  label: string
  tagColor?: string
}

export interface AddDay {
  year?: number
  month?: number
  day?: number
}

export interface Base {
  crprCd?: string // 회사코드
}

// 사용자 정보
export interface User extends Base {
  userId: string
  password: string
  ipAdrs?: string
  userInfo?: UserInfo
  hrInfo?: HrInfo
}

// 사용자 정보
export interface UserInfo extends Base {
  userId: string
  userNm: string
  userDvsn?: string
  loginId: string
  emplNo: string
  dprtCd: string
  dprtNm: string
  authList?: string[]
}
// 사용자 인사정보
export interface HrInfo extends Base {
  emplNo?: string
  emplNm?: string
  dprtCd?: string
  dprtNm?: string
  pstnCd?: string
  pstnNm?: string
  dutyCd?: string
  jobCd?: string
  jobNm?: string
  wkrGbCd?: string
  emplGbCd?: string
  tlphNo?: string
  clphNo?: string
  eMail?: string
}

// 메뉴 정보
export interface Menu extends Base {
  menuId: string // 메뉴번호
  menuPrntId: string // 상위메뉴ID
  menuNm: string // 메뉴명
  menuLvl: number // 화면레벨
  menuGbCd: string // 메뉴구분
  menuNo?: string
  prgrUrl?: string // 메뉴Url
  prgrId?: string // 화면ID
  description?: string // 메뉴설명
  selected?: boolean // 메뉴선택여부
  rootMenu?: string // 최상위메뉴
  children?: Menu[]
  systId?: string // 시스템ID
  icon?: string // 아이콘
}

export interface AntdMenu {
  key: string
  label: string
  bwgmenu?: Menu
  title?: string
  icon?: ReactNode
  danger?: boolean
  disabled?: boolean
  children?: AntdMenu[]
}

// 코드 정보
export interface Code extends Base {
  cdGrpId?: string // 코드그룹ID
  cdGrpNm?: string // 코드그룹명
  bizGbCd?: string // 업무구분코드
  useFl?: string // 사용여부
  cdId?: string // 코드ID
  cdNm?: string // 코드명
  cdEnm?: string // 코드영문명
  cdSort?: string // 코드정렬순서
}

// 메세지 정보
export interface Message extends Base {
  msgId?: string // 메세지ID
  msgLangCd?: string // 메세지언어코드
  bsicMsgCtt?: string // 기본메세지내용
  dtlMsgCtt?: string // 상세메세지내용
  bizGbCd?: string // 업무구분코드
  bizGbNm?: string // 업무구분명
  msgTypeCd?: string // 메세지유형코드
  msgTypeNm?: string // 메세지유형명
  useFl?: string // 사용여부
}

// 권한버튼 목록
export interface grantEventList {
  search?: () => void
  new?: () => void
  save?: () => void
  delete?: () => void
  print?: () => void
  file?: () => void
  draft?: () => void
  slip?: () => void
  slipCancel?: () => void
  // excelUp?: () => void     // 엑셀업로드 버튼 click 이벤트는 사용X. Page Prop으로 사용
  excelDown?: () => void
}

export interface popGrantEventList extends grantEventList {
  confirm?: () => void // 선택적용
  close?: () => void // 닫기
}

export interface popCallbackList {
  popCallback?: (param1: any, params2: any) => void
  closeCallback?: () => void
}

/** 주소 정보 속성 - 주소검색 API */
export interface AddrInfoProp {
  admCd: string
  bdKdcd: string
  bdMgtSn: string
  bdNm: string
  buldMnnm: string
  buldSlno: string
  detBdNmList: string
  emdNm: string
  emdNo: string
  engAddr: string
  jibunAddr: string
  liNm: string
  lnbrMnnm: string
  lnbrSlno: string
  mtYn: string
  rn: string
  rnMgtSn: string
  roadAddr: string
  roadAddrPart1: string
  roadAddrPart2: string
  sggNm: string
  siNm: string
  udrtYn: string
  zipNo: string
}

/** WorkFlowArea 컴포넌트에서 사용될 이벤트 */
export interface WorkFlowEvent {
  /** 워크플로우 입력 컴포넌트 데이터 가져오기 */
  getCmptData: () => { then: any; catch: any }
}
