import 'package:flutter/material.dart';
import 'package:jdc/constants.dart';
import 'package:jdc/res/gaps.dart';
import 'package:jdc/routes/fluro_navigator.dart';

/// 自定义dialog的模板
class BaseDialog extends StatelessWidget {
  const BaseDialog({Key? key, this.title, required this.onPressed, this.hiddenTitle = false, required this.child}) : super(key: key);

  final String? title;
  final VoidCallback onPressed;
  final Widget child;
  final bool hiddenTitle;

  @override
  Widget build(BuildContext context) {
    var dialogTitle = Visibility(
      visible: !hiddenTitle,
      child: Padding(
        padding: const EdgeInsets.only(bottom: 8.0),
        child: Text(
          title ?? "",
          style: TextStyle(fontSize: 18),
        ),
      ),
    );

    var bottomButton = Row(
      children: <Widget>[
        _DialogButton(
          text: '取消',
          textColor: Theme.of(context).focusColor,
          onPressed: () => NavigatorUtils.goBack(context),
        ),
        const SizedBox(
          height: 48.0,
          width: 0.6,
          child: VerticalDivider(),
        ),
        _DialogButton(
          text: '确定',
          textColor: primaryColor,
          onPressed: onPressed,
        ),
      ],
    );

    var body = Material(
      borderRadius: BorderRadius.circular(8.0),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Gaps.vGap24,
          hiddenTitle ? dialogTitle : Container(),
          Flexible(
            child: child,
            flex: 5,
          ),
          Gaps.vGap24,
          bottomButton,
        ],
      ),
    );

    return AnimatedPadding(
      padding: MediaQuery.of(context).viewInsets + const EdgeInsets.symmetric(horizontal: 40.0, vertical: 24.0),
      duration: const Duration(milliseconds: 120),
      curve: Curves.easeInCubic,
      child: MediaQuery.removeViewInsets(
        removeLeft: true,
        removeTop: true,
        removeRight: true,
        removeBottom: true,
        context: context,
        child: Center(
          child: SizedBox(
            width: 270.0,
            child: body,
          ),
        ),
      ),
    );
  }
}

class _DialogButton extends StatelessWidget {
  const _DialogButton({
    Key? key,
    required this.text,
    required this.textColor,
    required this.onPressed,
  }) : super(key: key);

  final String text;
  final Color textColor;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: SizedBox(
        height: 48.0,
        child: ElevatedButton(
          child: Text(
            text,
            style: TextStyle(fontSize: Dimens.font_sp18),
          ),
          style: ButtonStyle(
              backgroundColor: MaterialStateProperty.all(secondaryColor),
              textStyle: MaterialStateProperty.all<TextStyle>(TextStyle(color: textColor))),
          onPressed: onPressed,
        ),
      ),
    );
  }
}
