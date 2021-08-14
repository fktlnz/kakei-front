<template>
  <div>
    <div class="l-userfront p-gensen">
      <div class="c-title-wrap"><h1 class="c-title underline">ざっくり源泉徴収表</h1></div>
      <el-form ref="form" :model="table" label-width="110px">
        <div class="p-finance__diag--top">
          <el-form-item label="年収（万円）">
            <el-input v-model="income" placeholder="年収を入力して計算をクリック" />
          </el-form-item>
          <el-button type="primary" @click="onSetGensenTable(false)">計算</el-button>
        </div>
        <div class="p-finance__diag--bottom">
          <div class="p-finance__diag--bottom-in">
            <el-popover
              v-model="visible"
              placement="bottom"
              width="200"
              trigger="manual"
              content="控除等の詳細設定はこちらから"
            >
              <el-button id="js-open-detail-config" slot="reference" type="primary" disabled="disabled" @click="drawer = true , visible = false"><img src="@/assets/img/icon_config.png" alt="設定"></el-button>
              <!-- <el-button id="js-open-detail-config" type="primary" disabled="disabled" slot="reference" @click="visible = !visible"><img src="@/assets/img/icon_config.png" alt="設定"></el-button> -->
            </el-popover>
            <el-drawer
              title="詳細設定"
              :visible.sync="drawer"
              :direction="direction"
              size="50%"
            >
              <div class="p-finance__diag--bottom-drawer">
                <el-form ref="form" :model="config_tmp" label-width="160px">
                  <el-button style="float:right" @click="onResetParameters">値を元に戻す</el-button>
                  <h2 style="margin-top:40px">受給者</h2>
                  <el-form-item label="年収">
                    <el-input v-model="config_tmp.resipient.income" disabled />&nbsp;円
                  </el-form-item>
                  <el-form-item label="障害者"><a href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1160.htm" target="_blank"><img class="icon-question" src="@/assets/img/icon_question.png" alt="?"></a>
                    <el-radio-group v-model="config_tmp.resipient.defect">
                      <el-radio label="none">でない</el-radio>
                      <el-radio label="general">一般</el-radio>
                      <el-radio label="special">特別</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="寡婦/寡夫/ひとり親の控除対象"><a href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1170.htm" target="_blank"><img class="icon-question" src="@/assets/img/icon_question.png" alt="?"></a>
                    <el-select v-model="config_tmp.resipient.isWidow">
                      <el-option label="でない" value="none" />
                      <el-option label="寡婦(令和2年～)" value="widow" />
                      <el-option label="ひとり親(令和2年～)" value="sigleParent" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="勤労学生"><a href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1175.htm" target="_blank"><img class="icon-question" src="@/assets/img/icon_question.png" alt="?"></a>
                    <el-radio-group v-model="config_tmp.resipient.isStudent">
                      <el-radio label="false">でない</el-radio>
                      <el-radio label="true">である</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <h2>配偶者</h2>
                  <el-form-item label="控除対象"><a href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1191.htm" target="_blank"><img class="icon-question" src="@/assets/img/icon_question.png" alt="?"></a>
                    <el-select v-model="config_tmp.partner.target">
                      <el-option label="無" value="false" />
                      <el-option label="有(一般)" value="true" />
                      <el-option label="有(老人70歳～)" value="old" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="配偶者合計所得">
                    <el-input v-model="config_tmp.partner.income" />&nbsp;円
                  </el-form-item>
                  <h2>扶養親族の数</h2>
                  <el-form-item label="一般(16～18歳)"><a href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1180.htm" target="_blank"><img class="icon-question" src="@/assets/img/icon_question.png" alt="?"></a>
                    <el-select v-model="config_tmp.dependentFamilyCount.general">
                      <el-option label="0人" value="0" />
                      <el-option label="1人" value="1" />
                      <el-option label="2人" value="2" />
                      <el-option label="3人" value="3" />
                      <el-option label="4人" value="4" />
                      <el-option label="5人" value="5" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="特定(19～22歳)"><a href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1180.htm" target="_blank"><img class="icon-question" src="@/assets/img/icon_question.png" alt="?"></a>
                    <el-select v-model="config_tmp.dependentFamilyCount.specific">
                      <el-option label="0人" value="0" />
                      <el-option label="1人" value="1" />
                      <el-option label="2人" value="2" />
                      <el-option label="3人" value="3" />
                      <el-option label="4人" value="4" />
                      <el-option label="5人" value="5" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="成人(23～69歳)"><a href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1180.htm" target="_blank"><img class="icon-question" src="@/assets/img/icon_question.png" alt="?"></a>
                    <el-select v-model="config_tmp.dependentFamilyCount.adult">
                      <el-option label="0人" value="0" />
                      <el-option label="1人" value="1" />
                      <el-option label="2人" value="2" />
                      <el-option label="3人" value="3" />
                      <el-option label="4人" value="4" />
                      <el-option label="5人" value="5" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="老親(70歳～)"><a href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1180.htm" target="_blank"><img class="icon-question" src="@/assets/img/icon_question.png" alt="?"></a>
                    <el-select v-model="config_tmp.dependentFamilyCount.old">
                      <el-option label="0人" value="0" />
                      <el-option label="1人" value="1" />
                      <el-option label="2人" value="2" />
                      <el-option label="3人" value="3" />
                      <el-option label="4人" value="4" />
                      <el-option label="5人" value="5" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="上記、老親(70歳～)のうち同居"><a href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1180.htm" target="_blank"><img class="icon-question" src="@/assets/img/icon_question.png" alt="?"></a>
                    <el-select v-model="config_tmp.dependentFamilyCount.oldTogether">
                      <el-option label="0人" value="0" />
                      <el-option label="1人" value="1" />
                      <el-option label="2人" value="2" />
                      <el-option label="3人" value="3" />
                      <el-option label="4人" value="4" />
                      <el-option label="5人" value="5" />
                    </el-select>
                  </el-form-item>
                  <h2>障害者の数（受給者除く）</h2>
                  <el-form-item label="一般障害者"><a href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1160.htm" target="_blank"><img class="icon-question" src="@/assets/img/icon_question.png" alt="?"></a>
                    <el-select v-model="config_tmp.defectPersonCount.general">
                      <el-option label="0人" value="0" />
                      <el-option label="1人" value="1" />
                      <el-option label="2人" value="2" />
                      <el-option label="3人" value="3" />
                      <el-option label="4人" value="4" />
                      <el-option label="5人" value="5" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="特別障害者"><a href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1160.htm" target="_blank"><img class="icon-question" src="@/assets/img/icon_question.png" alt="?"></a>
                    <el-select v-model="config_tmp.defectPersonCount.special">
                      <el-option label="0人" value="0" />
                      <el-option label="1人" value="1" />
                      <el-option label="2人" value="2" />
                      <el-option label="3人" value="3" />
                      <el-option label="4人" value="4" />
                      <el-option label="5人" value="5" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="上記、特別障害者のうち同居"><a href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1160.htm" target="_blank"><img class="icon-question" src="@/assets/img/icon_question.png" alt="?"></a>
                    <el-select v-model="config_tmp.defectPersonCount.specialTogether">
                      <el-option label="0人" value="0" />
                      <el-option label="1人" value="1" />
                      <el-option label="2人" value="2" />
                      <el-option label="3人" value="3" />
                      <el-option label="4人" value="4" />
                      <el-option label="5人" value="5" />
                    </el-select>
                  </el-form-item>
                  <h2>所得金額特別控除</h2>
                  <el-form-item label="23歳未満の子供の数"><a href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1411.htm" target="_blank"><img class="icon-question" src="@/assets/img/icon_question.png" alt="?"></a>
                    <el-select v-model="config_tmp.incomeSpecialDeduction">
                      <el-option label="0人" value="0" />
                      <el-option label="1人" value="1" />
                      <el-option label="2人" value="2" />
                      <el-option label="3人" value="3" />
                      <el-option label="4人" value="4" />
                      <el-option label="5人" value="5" />
                    </el-select>
                  </el-form-item>
                  <h2>保険料等の控除</h2>
                  <el-form-item label="社会保険料等の金額">
                    <el-input v-model="config_tmp.insuranceFeeDeduction.socialInsurancePremiums" />&nbsp;円
                  </el-form-item>
                  <el-form-item label="生命保険料等の金額">
                    <el-input v-model="config_tmp.insuranceFeeDeduction.lifeInsurancePremiums" />&nbsp;円
                  </el-form-item>
                  <el-form-item label="地震保険料等の金額">
                    <el-input v-model="config_tmp.insuranceFeeDeduction.earthquakeInsurancePremiums" />&nbsp;円
                  </el-form-item>
                  <h2>住宅取得等の控除</h2>
                  <el-form-item label="住宅取得等特別控除額"><a href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1213.htm" target="_blank"><img class="icon-question" src="@/assets/img/icon_question.png" alt="?"></a>
                    <el-input v-model="config_tmp.housingAcquisitionSpecialDeduction" />&nbsp;円
                  </el-form-item>
                  <el-button type="primary" @click="onUpdateParameters">更新</el-button>
                  <el-button type="info" @click="drawer = false">閉じる</el-button>
                </el-form>
              </div>
            </el-drawer>
            <table>
              <tbody>
                <tr>
                  <td rowspan="5">支払いを受けるもの</td>
                  <td rowspan="5">住所または居所</td>
                  <td colspan="9" rowspan="5">神奈川県横浜市○○区○○xxxxxxxxxxx</td>
                  <td colspan="8">(受給者番号)xxxxxx</td>
                </tr>
                <tr>
                  <td colspan="8">-</td>
                </tr>
                <tr>
                  <td colspan="8">役職名</td>
                </tr>
                <tr>
                  <td rowspan="2">氏名</td>
                  <td colspan="7">(フリガナ)</td>
                </tr>
                <tr>
                  <td colspan="7">山田&nbsp;&nbsp;花子</td>
                </tr>
                <tr>
                  <td class="bold" colspan="3">種&nbsp;&nbsp;&nbsp;&nbsp;別</td>
                  <td class="bold" colspan="4">支&nbsp;&nbsp;払&nbsp;&nbsp;金&nbsp;&nbsp;額<img src="@/assets/img/icon_question.png" alt="?" @click="openModal('income')"><img id="js-click-show-switch" class="animation-click disable" src="@/assets/img/icon_hand.png" alt="手"></td>
                  <td class="bold" colspan="4"><span>給与所得控除後の金額(調整控除後)</span><img src="@/assets/img/icon_question.png" alt="?" @click="openModal('afterDeductionOfSalaryIncome')"></td>
                  <td class="bold" colspan="4">所得控除の額の合計額<img src="@/assets/img/icon_question.png" alt="?" @click="openModal('allDeductionOfSalaryIncome')"></td>
                  <td class="bold" colspan="4">源泉徴収税額<img src="@/assets/img/icon_question.png" alt="?" @click="openModal('incomeTax')"></td>
                </tr>
                <tr>
                  <td class="bold" colspan="3">給与・賞与</td>
                  <td class="bold" colspan="4">{{ table.income }}</td>
                  <td class="bold" colspan="4">{{ table.afterDeductionOfSalaryIncome }}</td>
                  <td class="bold" colspan="4">{{ table.allDeductionOfSalaryIncome }}</td>
                  <td class="bold" colspan="4">{{ table.incomeTax }}</td>
                </tr>
                <tr>
                  <td colspan="3">(源泉)控除対象配偶者の有無等</td>
                  <td colspan="4">配偶者(特別)控除の額</td>
                  <td colspan="7">控除対象扶養親族の数<br>(配偶者を除く。)</td>
                  <td>16歳未満扶養親族の数</td>
                  <td colspan="3">障害者の数<br>(本人を除く。)</td>
                  <td>非住居者である親族の数</td>
                </tr>
                <tr>
                  <td colspan="3">-</td>
                  <td colspan="4">-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td class="bold" colspan="5">社会保険料等の金額<img src="@/assets/img/icon_question.png" alt="?" @click="openModal('socialInsurancePremiums')"></td>
                  <td class="bold" colspan="5">生命保険料の控除額</td>
                  <td class="bold" colspan="5">地震保険料の控除額</td>
                  <td class="bold" colspan="4">住居借入金等特別控除の額</td>
                </tr>
                <tr>
                  <td class="bold" colspan="5">{{ table.socialInsurancePremiums }}</td>
                  <td class="bold" colspan="5">{{ table.lifeInsurancePremium }}</td>
                  <td class="bold" colspan="5">{{ table.earthquakeInsurancePremium }}</td>
                  <td class="bold" colspan="4">{{ table.housingMoney }}</td>
                </tr>
                <tr>
                  <td colspan="19">年調済</td>
                </tr>
                <tr>
                  <td colspan="2">生命保険料の金額の内訳</td>
                  <td colspan="2">新生命保険料の金額</td>
                  <td colspan="2">50，940</td>
                  <td colspan="2">旧生命保険料の金額</td>
                  <td colspan="2">0</td>
                  <td>介護医療保険料の金額</td>
                  <td colspan="2">39，596</td>
                  <td>新個人年金保険料の金額</td>
                  <td colspan="2">円</td>
                  <td>旧個人年金保険料の金額</td>
                  <td colspan="2">円</td>
                </tr>
                <tr>
                  <td>・・</td>
                  <td>・・</td>
                  <td>・・</td>
                  <td>・・</td>
                  <td>・・</td>
                  <td>・・</td>
                  <td>・・</td>
                  <td>・・</td>
                  <td>・・</td>
                  <td>・・</td>
                  <td>・・</td>
                  <td>・・</td>
                  <td>・・</td>
                  <td>・・</td>
                  <td>・・</td>
                  <td>・・</td>
                  <td>・・</td>
                  <td>・・</td>
                  <td>・・</td>
                </tr>
                <tr>
                  <td>・・</td>
                  <td>・・</td>
                  <td>・・</td>
                  <td>・・</td>
                  <td>・・</td>
                  <td>・・</td>
                  <td>・・</td>
                  <td>・・</td>
                  <td>・・</td>
                  <td>・・</td>
                  <td>・・</td>
                  <td>・・</td>
                  <td>・・</td>
                  <td>・・</td>
                  <td>・・</td>
                  <td>・・</td>
                  <td>・・</td>
                  <td>・・</td>
                  <td>・・</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </el-form>

      <!-- モーダルエリア -->
      <el-dialog :title="diag.title" :visible.sync="dialogFormVisible">
        <div>
          <div v-if="diag.key === 'income'" class="p-gensen__diag-comment">
            <!-- 支 払 金 額の説明 -->
            <p>
              ここには、いわゆる年収が記載されています。<br>
              <span style="display:inline-block;background-color:oldlace;padding:3px 5px;margin:25px 0 5px;font-size:18px;">日本の給与は上がっていない・・？</span><br>
              余談ですが、日本の給与は全然上がっていないってよく言われますよね。本当なのか見てみましょう。<br>
              図は昭和62年～令和元年の日本の平均年収の推移です。平成5年くらいまでは上がっているようですが、そこからは停滞しています。過去25年間で平均年収が上がっていない（むしろ下がっている）ので日本の給与は上がっていないと言われているということでしょう。
            </p>
            <div class="chart-wrapper">
              <bar-chart-income />
            </div>
            <p>
              <span style="display:inline-block;background-color:oldlace;padding:3px 5px;margin:25px 0 5px;font-size:18px;">高給取りの割合は・・？</span><br>
              余談の余談ですが、下記は、年収の分布です。300～400万円が17%で一番多くなっています。
              日本では年収が1,000万円を超えると高給取りと呼ばれますが、日本全体で5%ほどが高給取りに属しています。20人に1人の割合なので、学生時代のクラスメイトの1,2人は高給取りに属している（将来属する）計算ですね。
            </p>
            <div class="chart-wrapper">
              <pie-chart-income />
            </div>
          </div>
          <div v-if="diag.key === 'afterDeductionOfSalaryIncome'" class="p-gensen__diag-comment">
            <!-- 給与所得控除後の金額 -->
            <p>
              ここには"給与所得"の金額が記載されます。給与所得は、サラリーマンの概算経費のようなものだと考えるとよいと思っています。サラリーマンは経費がないと言われますが、一応そんなことはなくそれに相当するものを給与から差っ引いて税金を計算するようになっているのです。
              ただ、年収が850万円を超えると控除額は上限に達するので、年収が高い人にとってはその影響がどんどん小さくなっていて、高給取りの方にとって税的に不利だと言わざるを得ない感じです。<br>
              給与所得の計算式は下記で表されます<br>
              <span style="display:inline-block;background-color:#ddd;padding:3px 5px;margin:5px 0;">給与所得 = 給与収入 - 給与所得控除額</span><br>
              給与収入は支払金額（年収）のことです。給与所得控除額は、下表の通りに給与等の収入金額（支払金額）から自動で計算されます。
              税金は給与収入に対してかけるのではなく、一定額を差し引いた金額に税率をかけて算出します。この差し引く金額が多ければ多いほど税金は少なくなるのですが、サラリーマンの場合だと差し引く金額は「給与所得控除」と「所得控除」です<br>
              「給与所得控除」は下表で計算されるとして、「所得控除」はこの欄の右隣「所得控除の額の合計額」のところで説明します。
              <el-table
                :data="afterDeductionOfSalaryIncomeTableData"
                fit
                highlight-current-row
              >
                <el-table-column label="給与等の収入金額">
                  <template slot-scope="scope">
                    <span>{{ scope.row.income }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="給与所得控除額">
                  <template slot-scope="scope">
                    <span>{{ scope.row.deduction }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <small>※令和2年以降の計算式</small>
            </p>
          </div>
          <div v-if="diag.key === 'allDeductionOfSalaryIncome'" class="p-gensen__diag-comment">
            <!-- 所得控除の額の合計額 -->
            <p style="margin-bottom: -20px;">
              "給与所得控除"（概算経費のようなもの）以外の控除の合計額が、ここに記載されています。家庭の状況等に応じて一定額を差し引いてくれるわけですね。
              [赤枠で囲っている欄の合計額]に基礎控除（ほとんどの人にとっては48万円&nbsp;※下記「基礎控除」参照）を足した額に一致するはずです。一度計算してみてください。<br>
              <span style="display:inline-block;background-color:oldlace;padding:3px 5px;margin:25px 0 5px;font-size:18px;">基礎控除</span><br>
              納税者本人の合計所得金額に応じて控除額が下表の通りに決まります。ここでいう「納税者本人の合計所得金額」は、源泉徴収票の「給与所得控除後の金額」（この欄の左隣の額）が該当します。
              かなりの高給取りでない限り、ほとんどのサラリーマンが共通で対象となる控除で、サラリーマンの経費だと考えるといいかもしれません。
            </p>
            <el-table
              :data="baseDeductionTableData"
              fit
              highlight-current-row
            >
              <el-table-column label="納税者本人の合計所得金額">
                <template slot-scope="scope">
                  <span>{{ scope.row.allIncome }}</span>
                </template>
              </el-table-column>
              <el-table-column label="控除額">
                <template slot-scope="scope">
                  <span>{{ scope.row.deduction }}</span>
                </template>
              </el-table-column>
            </el-table>
            <p style="margin:30px 0 -10px;">
              下表に記載している控除が対象となる所得控除です。各項目リンクから国税庁のサイトに飛べるので詳しく知りたい方は参照してください。
            </p>
            <el-table
              :data="allDeductionOfSalaryIncomeTableData"
              :row-class-name="allDeductionOfSalaryIncomeTableRowClassName"
              fit
              highlight-current-row
            >
              <el-table-column label="控除の種類" width="130">
                <template slot-scope="scope">
                  <a :href="scope.row.href" target="_blank">{{ scope.row.type }}</a>
                </template>
              </el-table-column>
              <el-table-column
                label="説明"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.description }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="控除額"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.price }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-if="diag.key === 'incomeTax'" class="p-gensen__diag-comment">
            <!-- 源泉徴収税額 -->
            <p>
              この欄よりも左側の項目で下記の計算式が実施できます。<br>
              <span style="display:inline-block;background-color:#ddd;padding:3px 5px;margin:5px 0;">課税所得金額 = 給与収入 - 給与所得控除額 - 所得控除額</span><br>
              この課税所得金額に応じて、下表の計算式から源泉徴収税額（所得税額）が算出されます。<br>
              余談ですが、表を見ると、「×102.1%」となっていますが、「×100.0%」じゃないのと思いましたよね。この差分2.1%は、「復興特別所得税額」に相当するものです。<br>
              <span style="display:inline-block;background-color:oldlace;padding:3px 5px;margin:25px 0 5px;font-size:18px;">復興特別所得税とは</span><br>
              東日本大震災からの復興に必要な財源を確保するために創設された新しい税金です。サラリーマンなどの給与所得者は、源泉所得税について復興特別所得税額も含めて徴収されています。
            </p>
            <el-table
              :data="IncomeTaxTableData"
              fit
              highlight-current-row
            >
              <el-table-column label="課税所得金額(A)">
                <template slot-scope="scope">
                  <span>{{ scope.row.income }}</span>
                </template>
              </el-table-column>
              <el-table-column label="所得税率(B)" width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.rate }}</span>
                </template>
              </el-table-column>
              <el-table-column label="控除額(C)" width="130">
                <template slot-scope="scope">
                  <span>{{ scope.row.deduction }}</span>
                </template>
              </el-table-column>
              <el-table-column label="税額=（A×B−C）×102.1％">
                <template slot-scope="scope">
                  <span>{{ scope.row.formula }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-if="diag.key === 'socialInsurancePremiums'" class="p-gensen__diag-comment">
            <!-- 社会保険料等の金額 -->
            <p>
              ここにはあなたの<a style="text-decoration:underline;color:#2e70ff;" href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1130.htm">社会保険料控除</a>の金額が記載されています。<br>
              社会保険の種類は下表の通りです。会社勤めの方の場合は毎月、標準報酬月額のおよそ30%を会社と折半して納付しています。ざっくり給与の15%を納付しているので、かなりの額を毎月納付しています。日本は税金が高いと良く聞きますが、税金ではなく、社会保険料が高いことが源泉徴収票を見れば一目瞭然です。<br>
              また、保険料額の計算式は下記で、保険料率はそれぞれで定まります。ざっくり内訳は、健康保険(10%)、厚生年金保険(18.3%)、労働保険(2,3%)です。<br>
              <span style="display:inline-block;background-color:#ddd;padding:3px 5px;margin:5px 0;">毎月の保険料額 = 標準報酬月額  ×  保険料率</span><br>
              <span style="display:inline-block;background-color:#ddd;padding:3px 5px;margin:5px 0;">賞与の保険料額 = 標準賞与額  ×  保険料率</span><br>
              <span style="display:inline-block;background-color:oldlace;padding:3px 5px;margin:25px 0 5px;font-size:18px;">標準報酬月額、標準賞与額とは</span><br>
              健康保険・厚生年金保険では、被保険者が事業主から受ける毎月の給料などの報酬の月額を区切りのよい幅で区分した標準報酬月額と税引前の賞与総額から千円未満を切り捨てた標準賞与額（健康保険は年度の累計額573万円、厚生年金保険は1ヶ月あたり150万円が上限）を設定し、保険料の額や保険給付の額を計算します。
              この標準報酬月額に応じて、<a style="text-decoration:underline;color:#2e70ff;" href="https://www.kyoukaikenpo.or.jp/~/media/Files/shared/hokenryouritu/r3/ippan/r30213tokyo.pdf">保険料額表</a>（※令和3年度 東京都)によってその保険料率と額が決まります。
            </p>
            <el-table
              :data="socialInsurancePremiumsTableData"
              fit
              highlight-current-row
            >
              <el-table-column label="社会保険の種類" width="130">
                <template slot-scope="scope">
                  <a :href="scope.row.href" target="_blank">{{ scope.row.type }}</a>
                </template>
              </el-table-column>
              <el-table-column
                label="説明"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.description }}</span>
                </template>
              </el-table-column>
            </el-table>
            <span style="display:inline-block;background-color:#ff7b5b;padding:3px 5px;margin:25px 0 5px;font-size:15px;">注意</span><br>
            このサイトでは、社会保険料の自動計算の際、標準報酬月額および標準賞与額は計算しておりません。入力いただいた年収の15%を社会保険料として算出しており、本当にざっくりの計算なので、正確にはご自身の源泉徴収票をご参照くださいませ。
          </div>
          <h2 class="c-title underline">動画で勉強しよう</h2>
          <div :class="{'is-active':isActiveRecommend}" class="p-fr-recommend-container u-mb50">
            <div v-for="item in getFirstObj(items)" :key="item.id" :item="item" class="p-result-cards">
              <div class="result-card">
                <div class="result-card-header">
                  <p class="c-comment"><img src="@/assets/img/img_m.jpg" alt=""><span>{{ item.comment }}</span></p>
                  <span>{{ item.snippet.channelTitle }}</span>
                </div>
                <div class="result-card-thumbnail"><a :href="'https://www.youtube.com/watch?v=' + item.id" target="_blank"><img :src="item.snippet.thumbnails.standard.url" alt="アイキャッチ"></a></div>
                <div class="result-card-body">
                  <div class="result-card-body__tags"><span v-for="tag in onCsvToArr(item.subcategory)" :key="tag.id" :tag="tag">{{ tag }}</span></div>
                  <div class="result-card-body__title"><a :href="'https://www.youtube.com/watch?v=' + item.id" target="_blank">{{ item.snippet.title }}</a></div>
                  <div class="result-card-body__additional"><img src="@/assets/img/icon_eye.png" alt=""><span>{{ item.statistics.viewCount }}回</span><img src="@/assets/img/icon_heart.png" alt=""><span>{{ item.statistics.likeCount }}回</span></div>
                </div>
              </div>
            </div>
            <img class="c-loading" src="@/assets/img/loading.gif" alt="loading・・・">
          </div>
          <h2 class="c-title underline">関連動画</h2>
          <div :class="{'is-active':isActiveOtherRecommend}" class="p-fr-other-recommend-container">
            <div v-for="item in getObjNotFirst(items)" :key="item.id" :item="item" class="p-result-cards">
              <div class="result-card">
                <div class="result-card-header">
                  <p class="c-comment"><img src="@/assets/img/img_m.jpg" alt=""><span>{{ item.comment }}</span></p>
                  <span>{{ item.snippet.channelTitle }}</span>
                </div>
                <div class="result-card-thumbnail"><a :href="'https://www.youtube.com/watch?v=' + item.id" target="_blank"><img :src="item.snippet.thumbnails.standard.url" alt="アイキャッチ"></a></div>
                <div class="result-card-body">
                  <div class="result-card-body__tags"><span v-for="tag in onCsvToArr(item.subcategory)" :key="tag.id" :tag="tag">{{ tag }}</span></div>
                  <div class="result-card-body__title"><a :href="'https://www.youtube.com/watch?v=' + item.id" target="_blank">{{ item.snippet.title }}</a></div>
                  <div class="result-card-body__additional"><img src="@/assets/img/icon_eye.png" alt=""><span>{{ item.statistics.viewCount }}回</span><img src="@/assets/img/icon_heart.png" alt=""><span>{{ item.statistics.likeCount }}回</span></div>
                </div>
              </div>
            </div>
            <img class="c-loading" src="@/assets/img/loading.gif" alt="loading・・・">
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">閉じる</el-button>
        </span>
      </el-dialog>

    </div>
  </div>
</template>
<style>
.el-table .attention-row {
  background: oldlace;
  /* background: #77b7ff; */
}
.p-finance__diag--bottom .el-input {
  width: auto;
}
.p-finance__diag--bottom-drawer .el-form-item__label {
  padding: 0 5px 0 0;
}
.el-drawer__wrapper .el-drawer__body {
  overflow-y: scroll;
}
.el-drawer__wrapper .el-drawer__body .el-form {
  padding-top: 1px;
}
.el-popover {
  background: #77b7ff;
  color: #fff;
}
.el-popper[x-placement^=bottom] .popper__arrow::after {
  border-bottom-color: #77b7ff;
}
</style>
<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import $ from 'jquery'
import BarChartIncome from './components/gensen/income/BarChart'
import PieChartIncome from './components/gensen/income/PieChart'

const URL_API = 'http://localhost:80/kakei/kakei-api/public/api'

export default {
  name: 'Finance',
  components: {
    BarChartIncome,
    PieChartIncome
  },
  data() {
    return {
      income: '',
      table: {
        income: 0,
        afterDeductionOfSalaryIncome: 0, // 給与所得控除後の金額
        allDeductionOfSalaryIncome: 0, // 所得控除の額の合計
        incomeTax: 0, // 所得税
        socialInsurancePremiums: 0, // 社会保険料
        lifeInsurancePremium: 0, // 生命保険料
        earthquakeInsurancePremium: 0, // 地震保険料
        housingMoney: 0 // 住宅借入金等特別控除の額
      },
      config: {
        resipient: { // 受給者パラメータ
          income: 0,
          defect: 'none', // none:でない, general: 一般, special: 特別
          isWidow: 'none', // none:でない, widow: 寡婦, singleParent: ひとり親
          isStudent: 'false' // false:でない true:である
        },
        partner: { // 配偶者パラメータ
          target: 'false', // false:控除対象の人がいない, true: 控除対象有り, old:控除対象有り（老人70歳～）
          income: 0 // 配偶者合計所得
        },
        dependentFamilyCount: { // 扶養親族の数（配偶者除く）
          general: 0, // 一般(16～18歳)の数
          specific: 0, // 特定(19～22歳)の数
          adult: 0, // 成年(23～69歳)の数
          old: 0, // 老親(70歳～)
          oldTogether: 0 // 同居の老親
        },
        defectPersonCount: { // 障害者の数（受給者除く）
          general: 0, // 一般障害者
          special: 0, // 特別障害者
          specialTogether: 0 // 同居の特別障害者
        },
        incomeSpecialDeduction: 0, // 所得金額特別控除
        insuranceFeeDeduction: { // 保険料等の控除
          socialInsurancePremiums: 0, // 社会保険料等の金額
          lifeInsurancePremiums: 0, // 生命保険料等の金額
          earthquakeInsurancePremiums: 0 // 地震保険料等の金額
        },
        housingAcquisitionSpecialDeduction: 0, // 住宅取得等特別控除額
        bonusRate: 0.2, // 年収に占める賞与の割合
        bonusValue: 0 // 賞与の額
      },
      config_tmp: { // 設定パラメータ（ドロワー用）
        resipient: { // 受給者パラメータ
          income: '0',
          defect: 'none', // none:でない, general: 一般, special: 特別
          isWidow: 'none', // none:でない, widow: 寡婦, singleParent: ひとり親
          isStudent: 'false' // false:でない true:である
        },
        partner: { // 配偶者パラメータ
          target: 'false', // false:控除対象の人がいない, true: 控除対象有り, old:控除対象有り（老人70歳～）
          income: '0' // 配偶者合計所得
        },
        dependentFamilyCount: { // 扶養親族の数（配偶者除く）
          general: '0', // 一般(16～18歳)の数
          specific: '0', // 特定(19～22歳)の数
          adult: '0', // 成年(23～69歳)の数
          old: '0', // 老親(70歳～)
          oldTogether: '0' // 同居の老親
        },
        defectPersonCount: { // 障害者の数（受給者除く）
          general: '0', // 一般障害者
          special: '0', // 特別障害者
          specialTogether: '0' // 同居の特別障害者
        },
        incomeSpecialDeduction: '0', // 所得金額特別控除
        insuranceFeeDeduction: { // 保険料等の控除
          socialInsurancePremiums: '0', // 社会保険料等の金額
          lifeInsurancePremiums: '0', // 生命保険料等の金額
          earthquakeInsurancePremiums: '0' // 地震保険料等の金額
        },
        housingAcquisitionSpecialDeduction: '0', // 住宅取得等特別控除額
        bonusRate: 0.2, // 年収に占める賞与の割合
        bonusValue: 0 // 賞与の額
      },
      visible: false,
      afterDeductionOfSalaryIncomeTableData: [{
        income: '1,625,000円まで',
        deduction: '550,000円'
      }, {
        income: '1,625,001円から	1,800,000円まで',
        deduction: '収入金額×40％-100,000円'
      }, {
        income: '1,800,001円から	3,600,000円まで',
        deduction: '収入金額×30％+80,000円'
      }, {
        income: '3,600,001円から	6,600,000円まで',
        deduction: '収入金額×20％+440,000円'
      }, {
        income: '6,600,001円から	8,500,000円まで',
        deduction: '収入金額×10％+1,100,000円'
      }, {
        income: '8,500,001円以上',
        deduction: '1,950,000円（上限）'
      }],
      baseDeductionTableData: [{
        allIncome: '2,400万円以下',
        deduction: '48万円'
      }, {
        allIncome: '2,400万円～2450万円',
        deduction: '32万円'
      }, {
        allIncome: '2,450万円～2,500万円',
        deduction: '16万円'
      }, {
        allIncome: '2,500万円～',
        deduction: '0円'
      }],
      allDeductionOfSalaryIncomeTableData: [{
        type: '社会保険料控除',
        href: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1130.htm',
        description: '健康保険料、国民健康保険料、後期高齢者医療保険料、介護保険料、国民年金保険料、国民年金基金の掛金、厚生年金保険料などを支払った場合に適用される控除。生計を一にする配偶者その他の家族も含まれる。',
        price: '支払った保険料の合計'
      }, {
        type: '小規模企業共済等掛金控除',
        href: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1135.htm',
        description: '小規模企業共済等の掛金を支払った場合に適用される控除',
        price: '支払った掛金の合計額'
      }, {
        type: '生命保険料控除',
        href: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1140.htm',
        description: '生命保険や介護医療保険、 個人年金保険で、支払った保険料がある場合に適用される控除',
        price: '一定の方法で計算した金額（最高12万円）'
      }, {
        type: '地震保険料控除',
        href: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1145.htm',
        description: '地震保険料を支払った場合に適用される控除',
        price: '一定の方法で計算した金額（最高5万円）'
      }, {
        type: '障害者控除',
        href: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1160.htm',
        description: '納税者や同一生計配偶者、扶養親族が障害者である場合に適用される控除',
        price: '一人につき、(1)障害者27万円 (2)特別障害者40万円 (3)同居特別障害者75万円'
      }, {
        type: '寡婦（寡夫）控除',
        href: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1170.htm',
        description: '納税者の合計所得が500万円以下で、配偶者と死別または離婚して扶養親族がいる場合に適用される控除 ※寡夫控除は、令和2年分より、ひとり親控除に変更',
        price: '27万円'
      }, {
        type: 'ひとり親控除',
        href: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1171.htm',
        description: '納税者の合計所得が500万円以下で、納税者がひとり親であるときに適用される控除 ※ひとり親控除は令和2年分の所得税から適用',
        price: '35万円'
      }, {
        type: '勤労学生控除',
        href: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1175.htm',
        description: '学校に行きながら働いている場合に適用される控除 ※ただし、合計所得金額が75万円以下	',
        price: '27万円'
      }, {
        type: '配偶者控除',
        href: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1191.htm',
        description: '納税者の合計所得が1,000万円以下で、配偶者の合計所得が48万円以下の場合に適用される控除',
        price: '(1)一般控除対象配偶者:最大38万円 (2)老人控除対象配偶者:最大48万円(控除対象配偶者のうち年齢が70歳以上)'
      }, {
        type: '配偶者特別控除',
        href: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1180.htm',
        description: '納税者の合計所得が1,000万円以下で、配偶者の合計所得が48万円超133万円以下である場合に適用される控除',
        price: '配偶者の合計所得によって最大38万円'
      }, {
        type: '扶養控除',
        href: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1180.htm',
        description: '合計所得が48万円以下である16歳以上の子供や両親などを扶養している場合に適用される控除',
        price: '(1)一般の控除対象扶養親族:38万円 (2)特定扶養親族:63万円(扶養親族が19歳以上23歳未満の方) (3)老人扶養親族:最大58万円'
      }, {
        type: '基礎控除',
        href: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1199.htm',
        description: '納税者の合計所得が2,500万円以下である場合に適用される控除',
        price: '(1)合計所得 2,400万円以下:48万円 (2)合計所得 2,400万円超2,450万円以下:32万円 (3)合計所得 2,450万円超2,500万円以下:16万円'
      }],
      IncomeTaxTableData: [{
        income: ' 1,950,000円以下',
        rate: '5%',
        deduction: '-',
        formula: '(A×5%　　　　　 　) ×102.1%'
      }, {
        income: '1,950,000円超 3,300,000円以下',
        rate: '10%',
        deduction: '97,500円',
        formula: '(A×10% −　 97,500円）×102.1%'
      }, {
        income: '3,300,000円超 6,950,000円以下',
        rate: '20%',
        deduction: '427,500円',
        formula: '(A×20% −   427,500円）×102.1%'
      }, {
        income: '6,950,000円超 9,000,000円以下',
        rate: '23%',
        deduction: '636,000円',
        formula: '(A×23% −   636,000円）×102.1%'
      }, {
        income: '9,000,000円超 18,000,000円以下',
        rate: '33%',
        deduction: '1,536,000円',
        formula: '(A×33% − 1,536,000円）×102.1%'
      }, {
        income: '18,000,000円超 40,000,000円以下',
        rate: '40%',
        deduction: '2,796,000円',
        formula: '(A×40% − 2,796,000円）×102.1%'
      }, {
        income: '40,000,000円超',
        rate: '45%',
        deduction: '4,796,000円',
        formula: '(A×45% − 4,796,000円）×102.1%'
      }],
      socialInsurancePremiumsTableData: [{
        type: '健康保険',
        href: 'https://www.kyoukaikenpo.or.jp/',
        description: '会社勤めの方は、基本的に全国健康保険協会（協会けんぽ）に加入し、毎月会社と折半で納付します。およそ10%(個人負担5%)です。個人事業主の方は、市区町村が運営する国民健康保険に加入して納付することになります。'
      }, {
        type: '年金保険',
        href: 'https://www.nenkin.go.jp/service/riyoushabetsu/kounen/index.html',
        description: '会社勤めの場合は、勤務先が加入する厚生年金保険料を毎月納付します。厚生年金に納付することで国民年金も同時に納付しており2階建て（1階：国民年金、2階:厚生年金）の構成で年金を納付していることになります。厚生年金は18.3%(個人負担9.15%)と覚えてきましょう。'
      }, {
        type: '雇用保険',
        href: 'https://www.hellowork.mhlw.go.jp/insurance/insurance_summary.html',
        description: '政府が管掌する強制保険制度です。労働者の雇用の安定、就職促進、雇用拡大を目的とした保険です。雇用保険は完全に折半ではなく、個人負担3%, 会社負担6%のような感じになっていて、それほど負担は大きくありません。割合は、住居地や年度によって変わります。'
      }, {
        type: '介護保険',
        href: 'https://www.kyoukaikenpo.or.jp/~/media/Files/shared/jigyoukeikakuoyobiyosan/kaigo0211.pdf',
        description: '40歳以上の方は強制加入の保険です。家族の負担を軽減し、介護を社会全体で支えることを目的に、2000年に創設された制度です。個人負担は2,3%ほどなのでそれほど大きくはありません。'
      }],
      message: '',
      IsCommunicationShow: true,
      dialogFormVisible: false,
      diag: {
        income: {
          title: '支 払 金 額',
          tag: 'income'
        },
        afterDeductionOfSalaryIncome: {
          title: '給与所得控除後の金額',
          tag: 'deduction'
        },
        allDeductionOfSalaryIncome: {
          title: '所得控除の額の合計額',
          tag: 'deduction'
        },
        incomeTax: {
          title: '源泉徴収税額',
          tag: 'gensen'
        },
        socialInsurancePremiums: {
          title: '社会保険料等の金額',
          tag: 'socialInsurancePremiums'
        },
        title: '',
        description: ''
      },
      formLabelWidth: '120px',
      key: '',
      items: {},
      itemsTemp: {},
      requestOptions: {
        id: 'sM7958Hx4Yg,mi23LJoZHog,fU1Uq8W1Wl4,r21hg1AmXeY,v3fzEOZMIUs', // YouTube動画IDをカンマ区切りで複数指定可
        part: 'id, snippet, player, statistics, status'
      },
      isActiveRecommend: false, // オススメ動画の表示・非表示切り替え
      isActiveOtherRecommend: false, // 関連動画の表示・非表示切り替え
      drawer: false, // 詳細設定ドロワー
      direction: 'rtl' // ドロワーが開く方向
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  watch: {
    'config_tmp.resipient.income': function(val) {
      val = String(val).replace(/,/g, '')
      this.config_tmp.resipient.income = String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    'config_tmp.partner.income': function(val) {
      val = String(val).replace(/,/g, '')
      this.config_tmp.partner.income = String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    'config_tmp.insuranceFeeDeduction.socialInsurancePremiums': function(val) {
      val = String(val).replace(/,/g, '')
      this.config_tmp.insuranceFeeDeduction.socialInsurancePremiums = String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    'config_tmp.insuranceFeeDeduction.lifeInsurancePremiums': function(val) {
      val = String(val).replace(/,/g, '')
      this.config_tmp.insuranceFeeDeduction.lifeInsurancePremiums = String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    'config_tmp.insuranceFeeDeduction.earthquakeInsurancePremiums': function(val) {
      val = String(val).replace(/,/g, '')
      this.config_tmp.insuranceFeeDeduction.earthquakeInsurancePremiums = String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    'config_tmp.housingAcquisitionSpecialDeduction': function(val) {
      val = String(val).replace(/,/g, '')
      this.config_tmp.housingAcquisitionSpecialDeduction = String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    'table.income': function(val) {
      val = String(val).replace(/,/g, '')
      this.table.income = String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    'table.afterDeductionOfSalaryIncome': function(val) {
      val = String(val).replace(/,/g, '')
      this.table.afterDeductionOfSalaryIncome = String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    'table.allDeductionOfSalaryIncome': function(val) {
      val = String(val).replace(/,/g, '')
      this.table.allDeductionOfSalaryIncome = String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    'table.incomeTax': function(val) {
      val = String(val).replace(/,/g, '')
      this.table.incomeTax = String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    'table.socialInsurancePremiums': function(val) {
      val = String(val).replace(/,/g, '')
      this.table.socialInsurancePremiums = String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    'table.lifeInsurancePremium': function(val) {
      val = String(val).replace(/,/g, '')
      this.table.lifeInsurancePremium = String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    'table.earthquakeInsurancePremium': function(val) {
      val = String(val).replace(/,/g, '')
      this.table.earthquakeInsurancePremium = String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    'table.housingMoney': function(val) {
      val = String(val).replace(/,/g, '')
      this.table.housingMoney = String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  },
  mounted() {
  },
  methods: {
    onSetGensenTable(update = false) {
      // 数値/200万円以上かどうかチェック
      console.log(update)
      if (update === false) { // 更新以外のとき
        const rst = this.checkForm(update)
        if (rst === false) {
          return
        }
        // 支払い金額反映
        this.table.income = this.income * 10000
      } else {
        // 支払い金額反映
        this.table.income = this.config.resipient.income
        this.income = this.config.resipient.income / 10000
      }

      // =============== //
      // テーブルに値を反映する
      // =============== //
      this.updateTableVal(update)

      // =============== //
      // 詳細設定に値を反映する
      // =============== //

      // 年収
      this.config.resipient.income = this.income * 10000
      this.config_tmp.resipient.income = this.income * 10000

      // 詳細設定ボタンを有効化
      $('#js-open-detail-config').prop('disabled', false).removeClass('is-disabled')

      if (update === false) {
        // ツールチップ非表示
        this.visible = true
        // クリックハンド表示
        $('#js-click-show-switch').removeClass('disable')
      }
    },
    onUpdateParameters() { // パラメータを更新する
      console.log('update')
      const rst = this.checkForm(true)
      if (rst === false) {
        return
      }
      // 受給者
      this.config.resipient.income = this.getInt(this.config_tmp.resipient.income)
      this.config.resipient.defect = this.config_tmp.resipient.defect
      this.config.resipient.isWidow = this.config_tmp.resipient.isWidow
      this.config.resipient.isStudent = this.config_tmp.resipient.isStudent
      // 配偶者
      this.config.partner.target = this.config_tmp.partner.target
      this.config.partner.income = this.getInt(this.config_tmp.partner.income)
      // 扶養親族の数（配偶者除く）
      this.config.dependentFamilyCount.general = this.config_tmp.dependentFamilyCount.general
      this.config.dependentFamilyCount.specific = this.config_tmp.dependentFamilyCount.specific
      this.config.dependentFamilyCount.adult = this.config_tmp.dependentFamilyCount.adult
      this.config.dependentFamilyCount.old = this.config_tmp.dependentFamilyCount.old
      this.config.dependentFamilyCount.oldTogether = this.config_tmp.dependentFamilyCount.oldTogether
      // 障害者の数（受給者除く）
      this.config.defectPersonCount.general = this.config_tmp.defectPersonCount.general
      this.config.defectPersonCount.special = this.config_tmp.defectPersonCount.special
      this.config.defectPersonCount.specialTogether = this.config_tmp.defectPersonCount.specialTogether
      // 所得金額特別控除
      this.config.incomeSpecialDeduction = this.config_tmp.incomeSpecialDeduction
      // 保険料等の控除
      this.config.insuranceFeeDeduction.socialInsurancePremiums = this.getInt(this.config_tmp.insuranceFeeDeduction.socialInsurancePremiums)
      this.config.insuranceFeeDeduction.lifeInsurancePremiums = this.getInt(this.config_tmp.insuranceFeeDeduction.lifeInsurancePremiums)
      this.config.insuranceFeeDeduction.earthquakeInsurancePremiums = this.getInt(this.config_tmp.insuranceFeeDeduction.earthquakeInsurancePremiums)
      // 住宅取得等特別控除額
      this.config.housingAcquisitionSpecialDeduction = this.getInt(this.config_tmp.housingAcquisitionSpecialDeduction)
      // 年収に占める賞与の割合
      this.config.bonusRate = this.config_tmp.bonusRate
      // 賞与の額
      this.config.bonusValue = this.config_tmp.bonusValue

      // テーブル更新
      this.onSetGensenTable(true)
    },
    onResetParameters() { // パラメータをリセットする
      console.log('reset')
      console.log(this.config_tmp)
      this.config_tmp.resipient.income = this.config.resipient.income
      this.config_tmp.resipient.defect = this.config.resipient.defect
      this.config_tmp.resipient.isWidow = this.config.resipient.isWidow
      this.config_tmp.resipient.isStudent = this.config.resipient.isStudent
      // 配偶者
      this.config_tmp.partner.target = this.config.partner.target
      this.config_tmp.partner.income = this.config.partner.income
      // 扶養親族の数（配偶者除く）
      this.config_tmp.dependentFamilyCount.general = this.config.dependentFamilyCount.general
      this.config_tmp.dependentFamilyCount.specific = this.config.dependentFamilyCount.specific
      this.config_tmp.dependentFamilyCount.adult = this.config.dependentFamilyCount.adult
      this.config_tmp.dependentFamilyCount.old = this.config.dependentFamilyCount.old
      this.config_tmp.dependentFamilyCount.oldTogether = this.config.dependentFamilyCount.oldTogether
      // 障害者の数（受給者除く）
      this.config_tmp.defectPersonCount.general = this.config.defectPersonCount.general
      this.config_tmp.defectPersonCount.special = this.config.defectPersonCount.special
      this.config_tmp.defectPersonCount.specialTogether = this.config.defectPersonCount.specialTogether
      // 所得金額特別控除
      this.config_tmp.incomeSpecialDeduction = this.config.incomeSpecialDeduction
      // 保険料等の控除
      this.config_tmp.insuranceFeeDeduction.socialInsurancePremiums = this.config.insuranceFeeDeduction.socialInsurancePremiums
      this.config_tmp.insuranceFeeDeduction.lifeInsurancePremiums = this.config.insuranceFeeDeduction.lifeInsurancePremiums
      this.config_tmp.insuranceFeeDeduction.earthquakeInsurancePremiums = this.config.insuranceFeeDeduction.earthquakeInsurancePremiums
      // 住宅取得等特別控除額
      this.config_tmp.housingAcquisitionSpecialDeduction = this.config.housingAcquisitionSpecialDeduction
      // 年収に占める賞与の割合
      this.config_tmp.bonusRate = this.config.bonusRate
      // 賞与の額
      this.config_tmp.bonusValue = this.config.bonusValue
    },
    updateTableVal(update) {
      // 給与所得控除後の金額
      this.table.afterDeductionOfSalaryIncome = this.table.income - this.getDeductionOfSalaryIncome(this.table.income)
      // 所得控除の額の合計
      this.table.allDeductionOfSalaryIncome = this.getInsuranceFeeDeduction(update) + this.getOtherDeductionFee(update) + this.getBasicDeduction(this.table.income)
      // 課税所得額
      const taxableIncome = this.table.afterDeductionOfSalaryIncome - this.table.allDeductionOfSalaryIncome
      // 源泉徴収税額取得
      this.table.incomeTax = Math.floor(Number(this.getIncomeTax(taxableIncome)))
      // 社会保険料等の金額
      this.table.socialInsurancePremiums = this.config.insuranceFeeDeduction.socialInsurancePremiums
      // 生命保険料の控除額
      this.table.lifeInsurancePremium = this.config.insuranceFeeDeduction.lifeInsurancePremiums
      // 地震保険料の控除額
      this.table.earthquakeInsurancePremium = this.config.insuranceFeeDeduction.earthquakeInsurancePremiums
      // 住居借入金等特別控除の額
      this.table.housingMoney = this.config.housingAcquisitionSpecialDeduction
    },
    getDeductionOfSalaryIncome(income) { // 給与所得控除を取得
      if (income < 1625001) {
        return 550000
      } else if (income < 1800001) {
        return (income * 0.4 - 100000)
      } else if (income < 3600001) {
        return (income * 0.3 + 80000)
      } else if (income < 6600001) {
        return (income * 0.2 + 440000)
      } else if (income < 8500001) {
        return (income * 0.1 + 1100000)
      } else {
        return 1950000
      }
    },
    getIncomeTax(taxableIncome) {
      if (taxableIncome < 1000) {
        return 0
      } else if (taxableIncome < 1949000) {
        return (taxableIncome * 0.05) * 1.021
      } else if (taxableIncome < 3299000) {
        return (taxableIncome * 0.1 - 97500) * 1.021
      } else if (taxableIncome < 6949000) {
        return (taxableIncome * 0.2 - 427500) * 1.021
      } else if (taxableIncome < 8999000) {
        return (taxableIncome * 0.23 - 636000) * 1.021
      } else if (taxableIncome < 17999000) {
        return (taxableIncome * 0.33 - 1536000) * 1.021
      } else if (taxableIncome < 39999000) {
        return (taxableIncome * 0.4 - 2796000) * 1.021
      } else {
        return (taxableIncome * 0.45 - 4796000) * 1.021
      }
    },
    getBasicDeduction(income) {
      if (income <= 24000000) {
        return 480000
      } else if (income > 24000000 && income <= 24500000) {
        return 320000
      } else if (income > 24500000 && income <= 25000000) {
        return 160000
      } else if (income > 25000000) {
        return 0
      }
    },
    getInsuranceFeeDeduction(update) { // 保険料等を取得する
      // 社会保険料を計算
      var val = 0
      if (update === false) { // 初回は社会保険料のみ
        val = this.income * 10000 * 0.3 * 0.5
        this.config_tmp.insuranceFeeDeduction.socialInsurancePremiums = Number(val)
        this.config.insuranceFeeDeduction.socialInsurancePremiums = val
      } else {
        this.config.insuranceFeeDeduction.socialInsurancePremiums = (this.config.insuranceFeeDeduction.socialInsurancePremiums === undefined) ? '0' : this.config.insuranceFeeDeduction.socialInsurancePremiums
        this.config.insuranceFeeDeduction.lifeInsurancePremiums = (this.config.insuranceFeeDeduction.lifeInsurancePremiums === undefined) ? '0' : this.config.insuranceFeeDeduction.lifeInsurancePremiums
        this.config.insuranceFeeDeduction.earthquakeInsurancePremiums = (this.config.insuranceFeeDeduction.earthquakeInsurancePremiums === undefined) ? '0' : this.config.insuranceFeeDeduction.earthquakeInsurancePremiums
        val = Number(this.config.insuranceFeeDeduction.socialInsurancePremiums) +
                Number(this.config.insuranceFeeDeduction.lifeInsurancePremiums) +
                  Number(this.config.insuranceFeeDeduction.earthquakeInsurancePremiums)
      }
      return Number(val)
    },
    getOtherDeductionFee(update) {
      let val = 0
      const that = this
      // 障害者控除
      if (that.config.resipient.defect === 'general') {
        val += 270000
      } else if (that.config.resipient.defect === 'special') {
        val += 400000
      }

      // 寡婦/寡夫/ひとり親の控除
      if (that.config.resipient.isWidow === 'widow') {
        val += 270000
      } else if (that.config.resipient.defect === 'singleParent') {
        val += 350000
      }

      // 勤労学生控除
      if (that.config.resipient.isStudent === 'true') {
        val += 270000
      }

      // 配偶者控除
      const partnerDeduction = { // 配偶者控除表
        '900': { 'general': 380000, 'old': 480000 },
        '950': { 'general': 260000, 'old': 320000 },
        '1000': { 'general': 130000, 'old': 160000 }
      }

      const partnerSpecialDeduction = { // 配偶者特別控除表
        '900': { '48': 0, '95': 380000, '100': 360000, '105': 310000, '110': 260000, '115': 210000, '120': 160000, '125': 110000, '130': 60000, '135': 30000 },
        '950': { '48': 0, '95': 260000, '100': 240000, '105': 210000, '110': 180000, '115': 140000, '120': 110000, '125': 80000, '130': 40000, '135': 20000 },
        '1000': { '48': 0, '95': 130000, '100': 120000, '105': 110000, '110': 90000, '115': 70000, '120': 60000, '125': 40000, '130': 20000, '135': 10000 }
      }
      if (that.config.partner.income < 480000) { // 配偶者所得が48万円未満なら配偶者控除
        console.log('配偶者控除')
        let min = 0
        Object.keys(partnerDeduction).forEach(function(key) {
          if (min < Number(that.table.afterDeductionOfSalaryIncome) && Number(that.table.afterDeductionOfSalaryIncome) < Number(key) * 10000) {
            if (that.config.partner.target === 'true') {
              val += partnerDeduction[key]['general']
            } else if (that.config.partner.target === 'old') {
              val += partnerDeduction[key]['old']
            }
          }
          min = Number(key) * 10000
        })
      } else { // 配偶者所得が48万円超なら配偶者特別控除
        console.log('配偶者特別控除')
        let min = 0
        let min2 = 0
        Object.keys(partnerSpecialDeduction).forEach(function(key) {
          if (min < Number(that.table.afterDeductionOfSalaryIncome) && Number(that.table.afterDeductionOfSalaryIncome) < Number(key) * 10000) {
            Object.keys(partnerSpecialDeduction[key]).forEach(function(key2) {
              if (min2 < that.config.partner.income && that.config.partner.income < Number(key2) * 10000) {
                val += partnerSpecialDeduction[key][key2]
                console.log('partnerSpecialDeduction[key][key2]')
                console.log(partnerSpecialDeduction[key][key2])
              }
              min2 = Number(key2) * 10000
            })
          }
          min = Number(key) * 10000
        })
      }

      // 扶養控除
      if (this.config.dependentFamilyCount.general > 0) {
        // 一般の控除対象扶養親族(16～18歳)
        val += 380000 * this.config.dependentFamilyCount.general
      }
      if (this.config.dependentFamilyCount.specific > 0) {
        // 特定扶養親族(19～22歳)
        val += 630000 * this.config.dependentFamilyCount.specific
      }
      if (this.config.dependentFamilyCount.adult > 0) {
        // 一般の控除対象扶養親族(23～69歳)
        val += 380000 * this.config.dependentFamilyCount.adult
      }
      if (this.config.dependentFamilyCount.old > 0) {
        // 同居老親等以外の者(70歳～)
        val += 480000 * this.config.dependentFamilyCount.old
      }
      if (this.config.dependentFamilyCount.oldTogether > 0) {
        // 同居老親等(70歳～)
        val += 580000 * this.config.dependentFamilyCount.oldTogether
      }

      // 障害者控除（受給者除く）
      if (this.config.defectPersonCount.general > 0) {
        // 一般の控除対象扶養親族(16～18歳)
        val += 270000 * this.config.defectPersonCount.general
      }
      if (this.config.defectPersonCount.special > 0) {
        // 特定扶養親族(19～22歳)
        val += 400000 * this.config.defectPersonCount.special
      }
      if (this.config.defectPersonCount.specialTogether > 0) {
        // 一般の控除対象扶養親族(23～69歳)
        val += 750000 * this.config.defectPersonCount.specialTogether
      }

      // 所得金額特別控除
      if (this.config.resipient.income > 8500000 && (this.config.resipient.defect !== 'none' || this.config.incomeSpecialDeduction > 0)) {
        val += (this.config.resipient.income - 8500000) * 0.1
      }

      // 住宅取得等の控除
      val += Number(that.config.housingAcquisitionSpecialDeduction)

      console.log('OtherDeductionFee')
      console.log(val)
      return val
    },
    openModal(key) {
      this.diag.title = this.diag[key].title
      this.diag.description = this.diag[key].description
      this.diag.key = key
      $('#js-click-show-switch').addClass('disable')
      this.fetchData(this.diag[key].tag)
    },
    fetchData(type) {
      // リセット
      this.items = {}
      this.itemsTemp = {}
      this.isActiveRecommend = false
      this.isActiveOtherRecommend = false

      this.dialogFormVisible = true
      const url = URL_API + '/movieinfo?enableType=' + type
      return axios.get(url)
        .then((res) => {
          console.log('fetchdata')
          console.log(res)
          if (res.data.res === 'OK') {
            this.itemsTemp = res.data.rst // 登録Youtube情報をすべて取得
            this.requestOptions.id = res.data.ids.join(',') // 登録Youtubeの動画IDをカンマ区切りで取得
            this.getYoutubeInfo()
            this.isActiveRecommend = true
            this.isActiveOtherRecommend = true
          } else {
            this.$message({
              message: 'Fail!',
              type: 'warning'
            })
          }
        })
        .catch((res) => {
          console.log('cancelしたよ')
          this.$message({
            message: 'cancel!',
            type: 'warning'
          })
        })
    },
    getYoutubeInfo() {
      // 2. Initialize the JavaScript client library.
      const get = window.gapi.client.init({
        'apiKey': 'AIzaSyBZxW1R5-q0dXKJIpZdEDUBydS4OEQemNg'
        // clientId and scope are optional if auth is not required.
        // 'clientId': 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
        // 'scope': 'profile'
      }).then(() => {
        // 3. Initialize and make the API request.
        return window.gapi.client.request({
          'mine': '',
          'path': '/youtube/v3/videos',
          'params': this.requestOptions
        })
      }).then((response) => {
        this.items = response.result.items
        this.joinArray(this.itemsTemp, this.items)
      }, (reason) => {
        // console.log('Error: ' + reason.result.error.message)
      })

      window.gapi.load('client', get)
    },
    onCsvToArr(csv) {
      return csv.split(',')
    },
    joinArray(arr1, arr2) {
      var loop = 0
      var arrResult = []
      arr1.forEach((val) => {
        Object.assign(val, arr2[loop])
        arrResult.push(val)
        loop++
      })
      this.items = arrResult
    },
    getFirstObj(obj) {
      if (Object.keys(obj).length < 1) return
      return {
        0: Object.entries(obj)[0][1]
      }
    },
    getObjNotFirst(obj) {
      var rst = {}
      for (var key in obj) {
        if (key === '0') continue
        rst[key] = obj[key]
      }
      return rst
    },
    allDeductionOfSalaryIncomeTableRowClassName({ row, rowIndex }) {
      // 所得控除の額の合計額説明表のclass付け
      if (row.type === '社会保険料控除' || row.type === '配偶者控除' || row.type === '配偶者特別控除' || row.type === '基礎控除') {
        return 'attention-row'
      }
      return ''
    },
    checkForm(update) {
      if (update) {
        if (!Number.isInteger(Number(this.getInt(this.config_tmp.resipient.income))) ||
              !Number.isInteger(Number(this.getInt(this.config_tmp.insuranceFeeDeduction.socialInsurancePremiums))) ||
                !Number.isInteger(Number(this.getInt(this.config_tmp.insuranceFeeDeduction.lifeInsurancePremiums))) ||
                  !Number.isInteger(Number(this.getInt(this.config_tmp.insuranceFeeDeduction.earthquakeInsurancePremiums))) ||
                    !Number.isInteger(Number(this.getInt(this.config_tmp.housingAcquisitionSpecialDeduction)))) {
          this.$message({
            message: '入力に誤りがあります。数値を入力してください!',
            type: 'warning'
          })
          this.onResetParameters()
          return false
        } else if (Number(this.config_tmp.resipient.income) < 200) {
          this.$message({
            message: '200万円以上を入力してください',
            type: 'warning'
          })
          this.onResetParameters()
          return false
        }
        return true
      } else {
        if (!Number.isInteger(Number(this.income))) {
          this.$message({
            message: '数値を入力してください!',
            type: 'warning'
          })
          this.income = ''
          this.config.resipient.income = ''
          this.config_tmp.resipient.income = ''
          return false
        } else if (Number(this.income) < 200) {
          this.$message({
            message: '200万円以上を入力してください',
            type: 'warning'
          })
          this.income = ''
          this.config.resipient.income = ''
          this.config_tmp.resipient.income = ''
          return false
        }
        return true
      }
    },
    getInt(val) {
      val = Number(String(val).replace(/,/g, ''))
      return val
    }
  }
}
</script>

<style lang="scss" scoped>
table , td, th {
	border: 1px solid #595959;
	border-collapse: collapse;
    font-size: 12px;
}
td, th {
	padding: 5px 10px;
	width: 30px;
	height: 25px;
  line-height: 18px;
  &.bold {
    border: 2px solid #595959;
  }
  img {
    width: 18px;
    height: 18px;
    vertical-align: middle;
    margin-left: 18px;
    &:hover {
      opacity: .8;
      cursor: pointer;
    }
  }
}
th {
	background: #f0e6cc;
}
td {
  > span {
    display: inline-block;
    width: 120px;
    vertical-align: middle;
  }
}
.icon-question {
  width: 18px;
  height: 18px;
  vertical-align: middle;
  margin-right: 18px;
  &:hover {
    opacity: .8;
    cursor: pointer;
  }
}

.even {
	background: #fbf8f0;
}
.odd {
	background: #fefcf9;
}

.finance {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.p-finance__diag--top, .p-finance__diag--bottom {
  .el-form {
    width: 500px;
    margin: 0 auto;
    .el-form-item {
      .el-form-item__label {
        text-align: left;
      }
    }
  }
}
.p-finance__diag--top {
  width: 500px;
  margin: 0 auto;
  padding-bottom: 45px;
  max-width: 100%;
  .el-form-item {
    &:nth-child(2) {
      margin-bottom: 0;
    }
  }
  .el-button {
    padding: 10px 10px;
    float: right;
  }
}
.p-finance__diag--bottom {
  background-color: #eef6ff;
  padding: 5px 30px 30px;
  margin-left: -50px;
  margin-right: -50px;
  margin-bottom: 30px;
  &-drawer {
    padding: 0 10px 20px;
  }
  &-in {
    width: 858px;
    margin: 0 auto;
    max-width: 100%;
    .el-button#js-open-detail-config {
      width: 30px;
      height: 30px;
      padding: 4px;
      margin-bottom: 4px;
      float: right;
      img {
        width: 100%;
      }
    }
    .el-drawer__body {
      padding: 20px !important;
    }
  }
}
.p-finance__diag--btn-wrap {
  text-align: center;
  .el-form-item__content {
    margin-left: 0 !important;
  }
}
.c-btn.p-home__btn-finance-result {
  background-color: rgb(0, 175, 29);
  font-size: 22px;
  // padding: 8px 20px;
  width: 200px;
}
// 動画一覧
.p-fr-recommend-container {
  width: calc(50% - 50px);
  .p-result-cards {
    display: none;
  }
  &.is-active .p-result-cards {
    display: block;
  }
  &.is-active > img {
    display: none;
  }
  @media (max-width: 767px) {
    width: 100%;
  }
}
.p-fr-other-recommend-container {
  margin-right: -20px;
  > span {
  }
  .p-result-cards {
    display: none;
    position: relative;
    width: calc(50% - 20px);
    width: -webkit-calc(50% - 20px);
    margin-right: 20px;
    margin-bottom: 20px;
    min-height: 100px;
  }
  &.is-active .p-result-cards {
    display: inline-block;
  }
  &.is-active > img {
    display: none;
  }
  .result-card {
    width: 100%;
  }
  @media (max-width: 767px) {
    margin-right: 0;
    .p-result-cards {
      width: 100%;
      margin-right: 0;
      margin-bottom: 30px;
    }
  }
}
.p-gensen__diag-comment {
  position: relative;
  padding: 0.25em 1em;
  border-top: solid 1px #aaa;
  border-bottom: solid 1px #aaa;
  margin-bottom: 2em;
  > p {
    line-height: 1.5;
  }
  &:before, &:after {
    content: '';
    position: absolute;
    top: -7px;
    width: 1px;
    height: -webkit-calc(100% + 14px);
    height: calc(100% + 14px);
    background-color: #aaa;
  }
  &:before {
    left: 7px;
  }
  &:after {
    right: 7px;
  }
}

.p-result-cards {
  box-shadow: 0 2px 5px 2px #ddd;
  position: relative;
  min-height: 100px;
  .result-card {
    .result-card-header {
      padding: 10px 10px 5px;
      > span {
        background-color: #ff7b5b;
        display: inline-block;
        padding: 5px 15px;
        color: #fff;
        border-radius: 20px;
        font-size: 12px;
        width: 100%;
        text-align: center;
      }
    }

    .result-card-thumbnail {
      width: 100%;
      > a {
        &:hover {
          opacity: .8;
        }
        img {
          width: 100%;
        }
      }
    }

    .result-card-body {
      padding: 5px 10px 10px;
      &__tags {
        margin-bottom: 10px;
        > span {
          display: inline-block;
          background-color: #003099;
          padding: 5px 15px;
          color: #fff;
          border-radius: 20px;
          font-size: 12px;
          &:not(:last-child) {
            margin-right: 5px;
          }
        }
      }
      &__title {
        color: #2e70ff;
        margin-bottom: 5px;
        height: 35px;
        overflow: hidden;
        > a {
          display: inline-block;
          text-decoration: underline;
          &:hover {
            text-decoration: none;
          }
        }
      }
      &__additional {
        > span {
          margin: 0 30px 0 5px;
        }

        > span, img {
          vertical-align: middle;
        }
      }
    }
  }
}
// グラフ、テーブル
.chart-wrapper {
  padding-bottom: 30px;
}
.el-table {
  margin-top: 20px;
  .cell > a {
    text-decoration: underline;
    color: #2e70ff;
  }
}
.el-input__inner {
  width: auto !important;
}
//クリックアニメーション
@keyframes handslidein {
  0% {
    opacity: 0;
    right: 0;
    bottom: -20px;
  }
  30% {
    opacity: 1;
    right: 5px;
    bottom: -15px;
  }
  100% {
    opacity: 1;
    right: 5px;
    bottom: -15px;
  }
}
.animation-click {
  animation: 1s linear 0s infinite normal both running handslidein;
  position: relative;
  margin: 0;
  width: 35px;
  height: 35px;
}
.animation-click.disable {
  display: none;
}

</style>
