import {
  history,
  Link,
  type RequestConfig,
  type RunTimeLayoutConfig,
} from '@umijs/max';
import '@ant-design/v5-patch-for-react-19';
import { LinkOutlined } from '@ant-design/icons';
import {
  type Settings as LayoutSettings,
  SettingDrawer,
} from '@ant-design/pro-components';
import { ANT_PRO_SETTINGS } from 'config/consts';
import {
  AvatarDropdown,
  AvatarName,
  Footer,
  Question,
  SelectLang,
} from '@/components';
import { currentUser as queryCurrentUser } from '@/services/ant-design-pro/api';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';

const isDev = process.env.NODE_ENV === 'development' || process.env.CI;
const loginPath = '/user/login';

interface InitialState {
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}

/**
 * 返回值将成为全局初始状态
 * 页面刷新时, getInitialState 会被重新执行
 * https://umijs.org/docs/api/runtime-config#getinitialstate
 */
export async function getInitialState(): Promise<InitialState> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser({
        skipErrorHandler: true, // 跳过全局错误处理
      });
      return msg.data;
    } catch (_error) {
      history.push(loginPath);
    }
    return undefined;
  };

  // 从 localStorage 读取保存的设置
  const savedSettings = localStorage.getItem('antProSettings');

  // 解析设置（若不存在则使用默认配置）
  const initialSettings = savedSettings
    ? JSON.parse(savedSettings)
    : defaultSettings;

  // 非 登录/注册 相关页面(这些页面无需强制获取用户信息)
  if (
    ![loginPath, '/user/register', '/user/register-result'].includes(
      history.location.pathname,
    )
  ) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: initialSettings,
    };
  }

  // 登录/注册页, 不获取用户信息, 仅返回布局配置和获取用户信息的方法
  return {
    fetchUserInfo,
    settings: initialSettings,
  };
}

/**
 * https://procomponents.ant.design/components/layout
 */
export const layout: RunTimeLayoutConfig = ({
  initialState,
  setInitialState,
}) => {
  return {
    // 渲染右上角操作区
    actionsRender: () => [
      <Question key="doc" />, // 帮助按钮（链接到官方文档）
      <SelectLang key="SelectLang" />, // 语言选择组件（支持国际化切换）
    ],
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      // 自定义头像渲染（包裹下拉菜单，点击头像显示下拉操作）
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    // 水印是 PageContainer 的功能, layout 只是透传过去
    waterMarkProps: {
      content: initialState?.currentUser?.name,
      fontColor: '#ff0000',
    },
    footerRender: () => <Footer />,
    // 页面切换时的回调（监听路由变化，处理未登录跳转）
    onPageChange: () => {
      const { location } = history;
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    bgLayoutImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    // 左侧菜单额外链接（仅开发/测试环境显示 OpenAPI 文档链接，方便开发调试）
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
        ]
      : [],
    // 禁用菜单头部渲染（不显示默认的 logo 区域，可自定义）
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    // 自定义子组件渲染（包裹页面内容，添加开发环境的设置抽屉）
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children} {/* 页面实际内容 */}
          {isDev && (
            <SettingDrawer
              disableUrlParams // 禁用 URL 参数同步配置（避免刷新后配置丢失）
              enableDarkTheme // 支持深色主题切换
              settings={initialState?.settings} // 当前布局配置（从初始状态获取）
              // 配置变更时更新全局状态（保存用户的布局偏好）
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
                localStorage.setItem(
                  ANT_PRO_SETTINGS,
                  JSON.stringify(settings),
                );
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request: RequestConfig = {
  // 基础请求地址：开发环境使用相对路径（配合代理），生产环境使用线上地址
  baseURL: 'https://proapi.azurewebsites.net',
  // 合并错误处理配置（统一处理接口错误，如 401、500 等状态码）
  ...errorConfig,
};
