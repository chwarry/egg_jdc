import 'dart:async';
import 'dart:io';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import 'package:jdc/constants.dart';
import 'package:jdc/controllers/ScreenStateController.dart';
import 'package:jdc/models/node_list_model.dart';
import 'package:jdc/net/dio_utils.dart';
import 'package:jdc/net/http_api.dart';
import 'package:jdc/routes/fluro_navigator.dart';
import 'package:jdc/util/device_utils.dart';
import 'package:jdc/util/qs_common.dart';
import 'package:jdc/util/store.dart';
import 'package:jdc/util/utils.dart';
import 'package:jdc/widgets/base_dialog.dart';
import 'package:jdc/widgets/load_image.dart';
import 'package:jdc/widgets/my_button.dart';
import 'package:provider/provider.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:sp_util/sp_util.dart';
import 'package:url_launcher/url_launcher.dart';

class NodeInfoCard extends StatefulWidget {
  const NodeInfoCard({
    Key? key,
    required this.info,
  }) : super(key: key);

  final NodeListModel info;

  @override
  _NodeInfoCardState createState() => _NodeInfoCardState();
}

class _NodeInfoCardState extends State<NodeInfoCard> {
  late ScreenStateController screenStateController;
  late Timer _timer;

  @override
  void initState() {
    super.initState();
    screenStateController = Store.value<ScreenStateController>(context);
  }

  late Map<String, dynamic> qrcode;

  Future getQrcode(flag) async {
    await DioUtils.instance.requestNetwork(Method.get, HttpApi.getQrcode, onSuccess: (resultList) {
      print(resultList);
      qrcode = resultList;
      if (flag) {
        screenStateController.setQrcode(qrcode["qRCode"]);
      }
      _timer = Timer.periodic(Duration(milliseconds: 2500), (_) async {
        await checkLogin();
      });
      setState(() {});
    }, onError: (_, __) {
      print("error");
    });
  }

  // 检查是否登陆
  Future checkLogin() async {
    await DioUtils.instance.requestNetwork(Method.get, HttpApi.checkLogin,
        params: {"token": qrcode["token"], "okl_token": qrcode["okl_token"], "cookies": qrcode["cookies"]}, onSuccess: (resultList) {
      print(resultList);
      SpUtil.putString("eid", resultList["eid"]);
      SpUtil.putString("nickName", resultList["nickName"]);
      SpUtil.putString("timestamp", resultList["timestamp"]);
      _timer.cancel();

      screenStateController.setEid(resultList["eid"]);
      //刷新个人中心界面
      setState(() {});
    }, onError: (_, __) {
      print("error");
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
        //弹窗扫码
        showDialog(
            context: context,
            builder: (_) {
              return BaseDialog(
                  hiddenTitle: false,
                  onPressed: () {
                    NavigatorUtils.goBack(context);
                    GlobalKey jdsaoma = GlobalKey();
                    showElasticDialog(
                      context: context,
                      builder: (BuildContext context) {
                        return Material(
                          type: MaterialType.transparency,
                          child: Center(
                            child: Container(
                              width: 300,
                              height: 500,
                              margin: EdgeInsets.only(top: defaultPadding),
                              padding: EdgeInsets.all(defaultPadding),
                              decoration: BoxDecoration(
                                border: Border.all(width: 2, color: primaryColor.withOpacity(0.15)),
                                color: Colors.white,
                                borderRadius: const BorderRadius.all(
                                  Radius.circular(defaultPadding),
                                ),
                              ),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Padding(
                                    padding: EdgeInsets.all(20),
                                    child: Text("扫码完成后,返回本页面(app),查看是否登陆成功"),
                                  ),
                                  RepaintBoundary(
                                    key: jdsaoma,
                                    child: Selector<ScreenStateController, String>(
                                        builder: (_, qrcode, __) {
                                          return qrcode != ""
                                              ? Container(
                                                  decoration: BoxDecoration(
                                                    color: Colors.white,
                                                  ),
                                                  width: 300,
                                                  height: 350,
                                                  child: QrImage(
                                                    data: qrcode,
                                                    version: QrVersions.auto,
                                                    size: 200.0,
                                                  ),
                                                )
                                              : Container();
                                        },
                                        selector: (_, store) => store.qrCode),
                                  ),
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                                    children: [
                                      (Device.isAndroid || Device.isIOS)
                                          ? Selector<ScreenStateController, String>(
                                              builder: (_, qrcode, __) {
                                                return qrcode != ""
                                                    ? MyButton(
                                                        text: '截屏扫码',
                                                        onPressed: () async {
                                                          ByteData? byteData = await QSCommon.capturePngToByteData(jdsaoma);
                                                          // 保存
                                                          await QSCommon.saveImageToCamera(byteData!);
                                                        },
                                                      )
                                                    : Container();
                                              },
                                              selector: (_, store) => store.qrCode)
                                          : Container(),
                                      Selector<ScreenStateController, String>(
                                          builder: (_, qrcode, __) {
                                            return qrcode != ""
                                                ? MyButton(
                                                    text: '点击扫码登陆',
                                                    onPressed: () async {
                                                      //调用对应节点的扫码接口
                                                      SpUtil.putString("nodeUrl", widget.info.url);
                                                      SpUtil.putString("nodeName", widget.info.name);
                                                      await getQrcode(true);
                                                    },
                                                  )
                                                : Container();
                                          },
                                          selector: (_, store) => store.qrCode),
                                      (Device.isWeb || Device.isAndroid || Device.isIOS)
                                          ? MyButton(
                                              text: '进入京东app登陆',
                                              onPressed: () async {
                                                await getQrcode(false);
                                                var token = qrcode['token'];
                                                var url =
                                                    "openapp.jdmobile://virtual/ad?params={'category':'jump','des':'ThirdPartyLogin','action':'to','onekeylogin':'return','url':'https://plogin.m.jd.com/cgi-bin/m/tmauth?appid=300&client_type=m&token=$token','authlogin_returnurl':'weixin://','browserlogin_fromurl':''}";
                                                //跳转到京东进行点击
                                                if (await canLaunch(url)) {
                                                  await launch(url);
                                                } else {
                                                  throw 'Could not launch $url';
                                                }
                                              },
                                            )
                                          : Container(),
                                    ],
                                  )
                                ],
                              ),
                            ),
                          ),
                        );
                      },
                    );
                  },
                  child: Text(
                    "已经确定了扫码的风险了吗?",
                    style: TextStyle(color: Colors.redAccent),
                  ));
            });
      },
      child: Container(
        padding: EdgeInsets.all(defaultPadding),
        decoration: BoxDecoration(
          color: secondaryColor,
          borderRadius: const BorderRadius.all(Radius.circular(10)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: EdgeInsets.all(defaultPadding * 0.75),
                  height: 40,
                  width: 40,
                  decoration: BoxDecoration(
                    color: Color(0xFFA4CDFF).withOpacity(0.1),
                    borderRadius: const BorderRadius.all(Radius.circular(10)),
                  ),
                  child: SvgPicture.asset(
                    "assets/icons/one_drive.svg",
                    color: Color(0xFFA4CDFF),
                  ),
                ),
                // Icon(Icons.more_vert, color: Colors.white54)
              ],
            ),
            Text(
              widget.info.name,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            ProgressLine(
              color: Color(0xFFA4CDFF),
              percentage: widget.info.marginCount / widget.info.allCount,
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  "已使用:${widget.info.marginCount} ",
                  style: Theme.of(context).textTheme.caption!.copyWith(color: Colors.white70),
                ),
                Text(
                  "总共:${widget.info.allCount}",
                  style: Theme.of(context).textTheme.caption!.copyWith(color: Colors.white),
                ),
              ],
            )
          ],
        ),
      ),
    );
  }
}

class ProgressLine extends StatelessWidget {
  const ProgressLine({
    Key? key,
    this.color = primaryColor,
    required this.percentage,
  }) : super(key: key);

  final Color? color;
  final double? percentage;

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Container(
          width: double.infinity,
          height: 5,
          decoration: BoxDecoration(
            color: color!.withOpacity(0.1),
            borderRadius: BorderRadius.all(Radius.circular(10)),
          ),
        ),
        LayoutBuilder(
          builder: (context, constraints) => Container(
            width: constraints.maxWidth * percentage!,
            height: 5,
            decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.all(Radius.circular(10)),
            ),
          ),
        ),
      ],
    );
  }
}
