import autobind from "autobind-decorator";
import * as React from "react";
import { VirtualScroller } from "react-hyper-scroller";
import { RouteComponentProps, withRouter } from "react-router-dom";
import AppSettings, {
  ITestElementSettings,
  IValencesTestSettings,
} from "../../../AppSettings";
import ElementManager from "../../../ElementManager";
import { i18n } from "../../../Locale";
import { TEST_SELECTION } from "../../../routes";
import IconButton from "../../shared/icon-button/IconButton";
import Navbar from "../../shared/navbar/Navbar";
import TestElementSettings from "../../test-element-settings/TestElementSettings";
import "./ValencesTestSettings.scss";

export function getValencesTestSettings() {
  const settings = AppSettings.settings.tests.valences;

  if (!settings.elements) {
    setDefaultValencesTestSettings();
  }

  return settings;
}

export function setDefaultValencesTestSettings() {
  const settings = AppSettings.settings.tests.valences;
  const elements = ElementManager.getElements();

  settings.elements = elements
    .filter((element) => element.valency)
    .map((element) => ({
      atomic: element.atomic,
      enabled: element.testState.valencesTest,
      stats: {
        right: 0,
        times: 0,
        wrong: 0,
      },
    }));

  AppSettings.save();
}

type Props = RouteComponentProps<any> & React.Props<any>;

interface IValencesTestSettingsState {
  elementStates: ITestElementSettings[];
  updateListKey: number;
}

@autobind
class ValencesTestSettings extends React.Component<
  Props,
  IValencesTestSettingsState
> {
  public state: IValencesTestSettingsState = {
    elementStates: [],
    updateListKey: 0,
  };

  private settings: IValencesTestSettings = getValencesTestSettings();

  public componentDidMount() {
    this.setElementStates();
  }

  public render() {
    const { elementStates, updateListKey } = this.state;

    return (
      <div className="valences-test-settings">
        <Navbar
          title={i18n("nav_settings")}
          backButton={true}
          onBackButtonClick={this.onNavbarBackButtonClick}
        />

        <div className="valences-test-settings__content">
          <div className="valences-test-settings__text">
            {i18n("select_elements")}
          </div>

          <div className="valences-test-settings__buttons">
            <IconButton
              onClick={this.onSelectAllButtonClick}
              iconName="check_box_true"
              text={i18n("select_all")}
            />
            <IconButton
              onClick={this.onDeselectAllButtonClick}
              iconName="check_box_false"
              text={i18n("deselect_all")}
            />
            <IconButton
              onClick={this.onRestoreDefaultsButtonClick}
              iconName="restore"
              text={i18n("restore_defaults")}
            />
          </div>

          {/* TODO: Replace key usage with that doesn't rerender the full list */}
          <VirtualScroller
            key={`vts-${updateListKey}`}
            scrollRestoration={true}
            defaultRowHeight={64}
            rowCount={elementStates.length}
            rowRenderer={this.rowRenderer}
          />
        </div>
      </div>
    );
  }

  private rowRenderer(
    index: number,
    rowRef: (rowRef: React.ReactInstance) => void
  ) {
    const { elementStates } = this.state;
    const elementState = elementStates[index];

    return (
      <div key={elementState.atomic} ref={(div) => rowRef(div!)}>
        <TestElementSettings
          setting={elementState}
          onClick={this.onTestElementSettingsClick}
        />
      </div>
    );
  }

  private onSelectAllButtonClick() {
    this.settings.elements =
      this.settings.elements?.map((element) => ({
        ...element,
        enabled: true,
      })) ?? null;

    AppSettings.save();
    this.setElementStates();
  }

  private onDeselectAllButtonClick() {
    this.settings.elements =
      this.settings.elements?.map((element) => ({
        ...element,
        enabled: false,
      })) ?? null;

    AppSettings.save();
    this.setElementStates();
  }

  private onRestoreDefaultsButtonClick() {
    setDefaultValencesTestSettings();
    this.setElementStates();
  }

  private onTestElementSettingsClick(atomic: number) {
    const element = this.settings.elements?.find(
      (elementSettings) => elementSettings.atomic === atomic
    );

    if (!element) {
      // TODO: do something in this case
      return;
    }

    element.enabled = !element.enabled;

    AppSettings.save();

    this.setElementStates();
  }

  private onNavbarBackButtonClick() {
    const { history } = this.props;

    history.push(TEST_SELECTION);
  }

  private setElementStates() {
    const elements = this.settings.elements ?? [];

    this.setState((current) => ({
      elementStates: [...elements],
      updateListKey: current.updateListKey + 1,
    }));
  }
}

export default withRouter<Props, React.ComponentType<Props>>(
  ValencesTestSettings
);
