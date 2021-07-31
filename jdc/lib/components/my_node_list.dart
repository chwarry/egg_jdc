import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:jdc/models/node_list_model.dart';
import 'package:jdc/net/dio_utils.dart';
import 'package:jdc/net/http_api.dart';
import 'package:jdc/responsive.dart';
import 'package:flutter/material.dart';

import 'package:jdc/constants.dart';
import 'node_info_card.dart';

class MyNodeList extends StatefulWidget {
  const MyNodeList({
    Key? key,
  }) : super(key: key);

  @override
  _MyNodeListState createState() => _MyNodeListState();
}

class _MyNodeListState extends State<MyNodeList> {
  List<NodeListModel> nodeList = [];

  @override
  void initState() {
    //获取节点数据
    getNodeList();
    super.initState();
  }

  Future getNodeList() async {
    EasyLoading.show(status: '玩命加载中...');
    await DioUtils.instance.requestNetwork(Method.get, HttpApi.getNodeList, onSuccess: (resultList) {
      print(resultList);
      List.generate(10, (index) => nodeList.add(NodeListModel.fromJson(resultList[0])));
      setState(() {});
      EasyLoading.dismiss();
    }, onError: (_, __) {
      print("error");
      EasyLoading.dismiss();
    });
  }

  @override
  Widget build(BuildContext context) {
    final Size _size = MediaQuery.of(context).size;
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              "节点列表",
              style: Theme.of(context).textTheme.subtitle1,
            ),
          ],
        ),
        SizedBox(height: defaultPadding),
        Responsive(
          mobile: FileInfoCardGridView(
            crossAxisCount: _size.width < 650 ? 2 : 4,
            childAspectRatio: _size.width < 650 && _size.width > 350 ? 1.3 : 1,
            nodeListModel: nodeList,
          ),
          tablet: FileInfoCardGridView(
            nodeListModel: nodeList,
          ),
          desktop: FileInfoCardGridView(
            childAspectRatio: _size.width < 1400 ? 1.1 : 1.4,
            nodeListModel: nodeList,
          ),
        ),
      ],
    );
  }
}

class FileInfoCardGridView extends StatelessWidget {
  const FileInfoCardGridView({Key? key, this.crossAxisCount = 4, this.childAspectRatio = 1, required this.nodeListModel}) : super(key: key);

  final int crossAxisCount;
  final double childAspectRatio;
  final List<NodeListModel> nodeListModel;

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      physics: NeverScrollableScrollPhysics(),
      shrinkWrap: true,
      itemCount: nodeListModel.length,
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: crossAxisCount,
        crossAxisSpacing: defaultPadding,
        mainAxisSpacing: defaultPadding,
        childAspectRatio: childAspectRatio,
      ),
      itemBuilder: (context, index) => NodeInfoCard(info: nodeListModel[index]),
    );
  }
}
