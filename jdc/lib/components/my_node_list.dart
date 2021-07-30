import 'package:jdc/models/MyFiles.dart';
import 'package:jdc/models/node_list_model.dart';
import 'package:jdc/net/dio_utils.dart';
import 'package:jdc/net/http_api.dart';
import 'package:jdc/responsive.dart';
import 'package:flutter/material.dart';

import 'package:jdc/constants.dart';
import 'file_info_card.dart';

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
    getData();
    super.initState();
  }

  Future getData() async {
    await DioUtils.instance.requestNetwork(Method.get, HttpApi.getNodeList, onSuccess: (resultList) {
      print(resultList);
      List.generate(resultList.length, (index) => nodeList.add(NodeListModel.fromJson(resultList[index])));
    }, onError: (_, __) {
      print("error");
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
          ),
          tablet: FileInfoCardGridView(),
          desktop: FileInfoCardGridView(
            childAspectRatio: _size.width < 1400 ? 1.1 : 1.4,
          ),
        ),
      ],
    );
  }
}

class FileInfoCardGridView extends StatelessWidget {
  const FileInfoCardGridView({
    Key? key,
    this.crossAxisCount = 4,
    this.childAspectRatio = 1,
  }) : super(key: key);

  final int crossAxisCount;
  final double childAspectRatio;

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      physics: NeverScrollableScrollPhysics(),
      shrinkWrap: true,
      itemCount: demoMyFiles.length,
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: crossAxisCount,
        crossAxisSpacing: defaultPadding,
        mainAxisSpacing: defaultPadding,
        childAspectRatio: childAspectRatio,
      ),
      itemBuilder: (context, index) => FileInfoCard(info: demoMyFiles[index]),
    );
  }
}
